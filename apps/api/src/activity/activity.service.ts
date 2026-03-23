import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { Queue } from 'bullmq';
import Redis from 'ioredis';
import { ACTIVITY_LOG_QUEUE, NOTIFICATIONS_QUEUE, REDIS_CONNECTION } from '../redis/redis.constants';
import { ActivityLogJobData } from './activity.types';

@Injectable()
export class ActivityService implements OnModuleDestroy {
  private readonly activityLogQueue: Queue<ActivityLogJobData>;
  private readonly notificationsQueue: Queue;

  constructor(@Inject(REDIS_CONNECTION) private readonly redis: Redis) {
    this.activityLogQueue = new Queue<ActivityLogJobData>(ACTIVITY_LOG_QUEUE, {
      connection: this.redis.duplicate(),
      defaultJobOptions: {
        removeOnComplete: 100,
        removeOnFail: 500,
      },
    });

    this.notificationsQueue = new Queue(NOTIFICATIONS_QUEUE, {
      connection: this.redis.duplicate(),
      defaultJobOptions: {
        removeOnComplete: 100,
        removeOnFail: 500,
      },
    });
  }

  async enqueueTaskActivity(data: ActivityLogJobData) {
    const job = await this.activityLogQueue.add('write-activity-log', data);
    return { queued: true, jobId: job.id };
  }

  async enqueueNotification(data: Record<string, unknown>) {
    const job = await this.notificationsQueue.add('notification', data);
    return { queued: true, jobId: job.id };
  }

  async onModuleDestroy() {
    await this.activityLogQueue.close();
    await this.notificationsQueue.close();
  }
}
