import { Injectable, NotFoundException } from '@nestjs/common';
import { GlobalTaskStatus } from '@agentflow/types';
import { ActivityService } from '../activity/activity.service';
import { EventsGateway } from '../websocket/websocket.gateway';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { ListTasksDto } from './dto/list-tasks.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activityService: ActivityService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  async create(slug: string, dto: CreateTaskDto) {
    const project = await this.prisma.project.findUnique({ where: { slug } });

    if (!project) {
      throw new NotFoundException(`Project ${slug} not found`);
    }

    const task = await this.prisma.task.create({
      data: {
        projectId: project.id,
        title: dto.title,
        description: dto.description,
        status: dto.status ?? GlobalTaskStatus.BACKLOG,
        customStatusId: dto.customStatusId,
        priority: dto.priority,
        assigneeUserId: dto.assigneeUserId,
        assigneeAgentId: dto.assigneeAgentId,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        createdByType: 'HUMAN',
        createdById: project.ownerId,
      },
      include: this.taskInclude,
    });

    const enrichedTask = await this.enrichTask(task);

    await this.activityService.enqueueTaskActivity({
      taskId: task.id,
      actorUserId: project.ownerId,
      action: 'task_created',
      metadata: {
        projectId: project.id,
        title: task.title,
        status: task.status,
      },
    });

    this.eventsGateway.emitTaskCreated(project.id, {
      task: enrichedTask,
      projectId: project.id,
    });

    if (task.assigneeUserId || task.assigneeAgentId) {
      this.eventsGateway.emitTaskAssigned(project.id, {
        taskId: task.id,
        assigneeId: task.assigneeAgentId ?? task.assigneeUserId,
        assigneeType: task.assigneeAgentId ? 'AGENT' : 'HUMAN',
      });
    }

    return { data: enrichedTask };
  }

  async findAll(slug: string, query: ListTasksDto) {
    const project = await this.prisma.project.findUnique({ where: { slug } });

    if (!project) {
      throw new NotFoundException(`Project ${slug} not found`);
    }

    const tasks = await this.prisma.task.findMany({
      where: {
        projectId: project.id,
        status: query.status,
        priority: query.priority,
        assigneeUserId: query.assigneeUserId,
        assigneeAgentId: query.assigneeAgentId,
      },
      include: this.taskInclude,
      orderBy: { createdAt: 'asc' },
    });

    return { data: await this.enrichTasks(tasks), meta: { projectId: project.id, filters: query } };
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        ...this.taskInclude,
        subtasks: {
          include: this.taskInclude,
          orderBy: { createdAt: 'asc' },
        },
        comments: {
          include: {
            authorUser: true,
            authorAgent: true,
          },
          orderBy: { createdAt: 'asc' },
        },
        activityLogs: {
          include: {
            actorUser: true,
            actorAgent: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!task) {
      throw new NotFoundException(`Task ${id} not found`);
    }

    const enriched = await this.enrichTask(task);
    const subtasks = task.subtasks ? await this.enrichTasks(task.subtasks) : [];

    return {
      data: {
        ...enriched,
        subtasks,
      },
    };
  }

  async update(id: string, dto: UpdateTaskDto) {
    const existing = await this.ensureExists(id);

    const task = await this.prisma.task.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status,
        customStatusId: dto.customStatusId,
        priority: dto.priority,
        assigneeUserId: dto.assigneeUserId,
        assigneeAgentId: dto.assigneeAgentId,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      },
      include: this.taskInclude,
    });

    const enrichedTask = await this.enrichTask(task);

    await this.activityService.enqueueTaskActivity({
      taskId: task.id,
      actorUserId: existing.project.ownerId,
      action: 'task_updated',
      metadata: {
        before: {
          title: existing.title,
          description: existing.description,
          status: existing.status,
          priority: existing.priority,
          assigneeUserId: existing.assigneeUserId,
          assigneeAgentId: existing.assigneeAgentId,
        },
        after: {
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          assigneeUserId: task.assigneeUserId,
          assigneeAgentId: task.assigneeAgentId,
        },
      },
    });

    this.eventsGateway.emitTaskUpdated(existing.projectId, {
      taskId: task.id,
      changes: dto,
      actorId: existing.project.ownerId,
      actorType: 'HUMAN',
      task: enrichedTask,
    });

    if (
      existing.assigneeUserId !== task.assigneeUserId ||
      existing.assigneeAgentId !== task.assigneeAgentId
    ) {
      this.eventsGateway.emitTaskAssigned(existing.projectId, {
        taskId: task.id,
        assigneeId: task.assigneeAgentId ?? task.assigneeUserId,
        assigneeType: task.assigneeAgentId ? 'AGENT' : 'HUMAN',
      });

      if (task.assigneeAgentId) {
        this.eventsGateway.emitAgentActivity(existing.projectId, {
          agentId: task.assigneeAgentId,
          taskId: task.id,
          action: 'assigned',
          metadata: {
            previousAgentId: existing.assigneeAgentId ?? undefined,
          },
        });
      }
    }

    return { data: enrichedTask };
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.task.delete({ where: { id } });
    return { data: { id, deleted: true } };
  }

  async updateStatus(id: string, dto: UpdateTaskStatusDto) {
    const existing = await this.ensureExists(id);

    const task = await this.prisma.task.update({
      where: { id },
      data: {
        status: dto.status,
        customStatusId: dto.customStatusId,
      },
      include: this.taskInclude,
    });

    const enrichedTask = await this.enrichTask(task);

    await this.activityService.enqueueTaskActivity({
      taskId: id,
      actorUserId: existing.project.ownerId,
      action: 'status_changed',
      metadata: {
        from: existing.status,
        to: dto.status,
      },
    });

    this.eventsGateway.emitTaskStatusChanged(existing.projectId, {
      taskId: id,
      from: existing.status,
      to: dto.status,
      actorId: existing.project.ownerId,
      actorType: 'HUMAN',
      task: enrichedTask,
    });

    if (task.assigneeAgentId) {
      this.eventsGateway.emitAgentActivity(existing.projectId, {
        agentId: task.assigneeAgentId,
        taskId: task.id,
        action: 'status_changed',
        metadata: {
          from: existing.status,
          to: dto.status,
        },
      });
    }

    this.eventsGateway.emitTaskUpdated(existing.projectId, {
      taskId: task.id,
      changes: { status: dto.status, customStatusId: dto.customStatusId },
      actorId: existing.project.ownerId,
      actorType: 'HUMAN',
      task: enrichedTask,
    });

    return { data: enrichedTask };
  }

  async createSubtask(id: string, dto: CreateSubtaskDto) {
    const parent = await this.ensureExists(id);

    const subtask = await this.prisma.task.create({
      data: {
        projectId: parent.projectId,
        parentId: parent.id,
        title: dto.title ?? 'Untitled subtask',
        description: dto.description,
        status: dto.status ?? GlobalTaskStatus.BACKLOG,
        customStatusId: dto.customStatusId,
        priority: dto.priority ?? parent.priority,
        assigneeUserId: dto.assigneeUserId,
        assigneeAgentId: dto.assigneeAgentId,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        createdByType: parent.createdByType,
        createdById: parent.createdById,
      },
      include: this.taskInclude,
    });

    const enrichedSubtask = await this.enrichTask(subtask);

    await this.activityService.enqueueTaskActivity({
      taskId: subtask.id,
      actorUserId: parent.project.ownerId,
      action: 'subtask_created',
      metadata: {
        parentId: parent.id,
        projectId: parent.projectId,
      },
    });

    this.eventsGateway.emitTaskCreated(parent.projectId, {
      task: enrichedSubtask,
      projectId: parent.projectId,
      parentId: parent.id,
    });

    return { data: enrichedSubtask };
  }

  async getActivity(id: string) {
    await this.ensureExists(id);

    const items = await this.prisma.activityLog.findMany({
      where: { taskId: id },
      include: {
        actorUser: true,
        actorAgent: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return { data: items };
  }

  private async ensureExists(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        project: true,
      },
    });

    if (!task) {
      throw new NotFoundException(`Task ${id} not found`);
    }

    return task;
  }

  private async enrichTask(task: any) {
    const numbered = await this.computeDisplayIds(task.projectId);
    return {
      ...task,
      displayId: numbered.get(task.id),
    };
  }

  private async enrichTasks(tasks: any[]) {
    if (!tasks.length) return tasks;
    const projectId = tasks[0].projectId;
    const numbered = await this.computeDisplayIds(projectId);
    return tasks.map((task) => ({
      ...task,
      displayId: numbered.get(task.id),
    }));
  }

  private async computeDisplayIds(projectId: string) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } });
    const tasks = await this.prisma.task.findMany({
      where: { projectId },
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
      select: { id: true },
    });

    const prefix = (project?.slug || 'back')
      .split(/[-_]/)[0]
      .replace(/[^a-zA-Z]/g, '')
      .toUpperCase()
      .slice(0, 4) || 'BACK';

    return new Map(tasks.map((task, index) => [task.id, `${prefix}-${111 + index}`]));
  }

  private readonly taskInclude = {
    project: true,
    customStatus: true,
    assigneeUser: true,
    assigneeAgent: true,
    _count: {
      select: {
        subtasks: true,
        comments: true,
        activityLogs: true,
      },
    },
  } as const;
}
