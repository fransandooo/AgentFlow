import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Worker } from 'bullmq';
import Redis from 'ioredis';
import { PrismaService } from '../prisma/prisma.service';
import { ACTIVITY_LOG_QUEUE, REDIS_CONNECTION } from '../redis/redis.constants';
import { ActivityLogJobData } from './activity.types';

@Injectable()
export class ActivityProcessor implements OnModuleInit, OnModuleDestroy {
  private worker?: Worker<ActivityLogJobData>;

  constructor(
    @Inject(REDIS_CONNECTION) private readonly redis: Redis,
    private readonly prisma: PrismaService,
  ) {}

  onModuleInit() {
    this.worker = new Worker<ActivityLogJobData>(
      ACTIVITY_LOG_QUEUE,
      async (job) => {
        await this.prisma.activityLog.create({
          data: {
            taskId: job.data.taskId,
            actorUserId: job.data.actorUserId,
            actorAgentId: job.data.actorAgentId,
            action: job.data.action,
            metadata: job.data.metadata as Prisma.InputJsonValue,
          },
        });
      },
      {
        connection: this.redis.duplicate(),
      },
    );
  }

  async onModuleDestroy() {
    await this.worker?.close();
  }
}
