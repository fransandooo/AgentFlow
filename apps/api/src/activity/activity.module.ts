import { Module } from '@nestjs/common';
import { RedisModule } from '../redis/redis.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ActivityProcessor } from './activity.processor';
import { ActivityService } from './activity.service';

@Module({
  imports: [RedisModule, PrismaModule],
  providers: [ActivityService, ActivityProcessor],
  exports: [ActivityService],
})
export class ActivityModule {}
