import { Injectable, NotFoundException } from '@nestjs/common';
import { ActivityService } from '../activity/activity.service';
import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '../websocket/websocket.gateway';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activityService: ActivityService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  async create(taskId: string, dto: CreateCommentDto) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { project: true },
    });

    if (!task) {
      throw new NotFoundException(`Task ${taskId} not found`);
    }

    const comment = await this.prisma.comment.create({
      data: {
        taskId,
        authorUserId: task.project.ownerId,
        content: dto.content,
      },
      include: {
        authorUser: true,
        authorAgent: true,
      },
    });

    await this.activityService.enqueueTaskActivity({
      taskId,
      actorUserId: task.project.ownerId,
      action: 'comment_added',
      metadata: {
        commentId: comment.id,
      },
    });

    this.eventsGateway.emitTaskCommentAdded(task.projectId, {
      taskId,
      comment,
    });

    return { data: comment };
  }

  async findAll(taskId: string) {
    const items = await this.prisma.comment.findMany({
      where: { taskId },
      include: {
        authorUser: true,
        authorAgent: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    return { data: items };
  }

  async remove(id: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });

    if (!comment) {
      throw new NotFoundException(`Comment ${id} not found`);
    }

    await this.prisma.comment.delete({ where: { id } });
    return { data: { id, deleted: true } };
  }
}
