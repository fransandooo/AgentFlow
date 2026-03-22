import { Injectable, NotFoundException } from '@nestjs/common';
import { GlobalTaskStatus } from '@agentflow/types';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { ListTasksDto } from './dto/list-tasks.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

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
        status: dto.status ?? GlobalTaskStatus.TODO,
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

    return { data: task };
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
      orderBy: { updatedAt: 'desc' },
    });

    return { data: tasks, meta: { projectId: project.id, filters: query } };
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

    return { data: task };
  }

  async update(id: string, dto: UpdateTaskDto) {
    await this.ensureExists(id);

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

    return { data: task };
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

    await this.prisma.activityLog.create({
      data: {
        taskId: id,
        actorUserId: existing.project.ownerId,
        action: 'status_changed',
        metadata: {
          from: existing.status,
          to: dto.status,
        },
      },
    });

    return { data: task };
  }

  async createSubtask(id: string, dto: CreateSubtaskDto) {
    const parent = await this.ensureExists(id);

    const subtask = await this.prisma.task.create({
      data: {
        projectId: parent.projectId,
        parentId: parent.id,
        title: dto.title ?? 'Untitled subtask',
        description: dto.description,
        status: dto.status ?? GlobalTaskStatus.TODO,
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

    return { data: subtask };
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
