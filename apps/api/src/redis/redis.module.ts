import { Global, Module } from '@nestjs/common';
import Redis from 'ioredis';
import { env } from '../config/env';
import { REDIS_CONNECTION } from './redis.constants';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CONNECTION,
      useFactory: () =>
        new Redis(env.redisUrl, {
          maxRetriesPerRequest: null,
        }),
    },
    RedisService,
  ],
  exports: [REDIS_CONNECTION, RedisService],
})
export class RedisModule {}
