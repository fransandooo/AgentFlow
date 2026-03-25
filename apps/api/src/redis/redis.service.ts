import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CONNECTION } from './redis.constants';

@Injectable()
export class RedisService implements OnModuleDestroy {
  constructor(@Inject(REDIS_CONNECTION) private readonly redis: Redis) {}

  getClient() {
    return this.redis;
  }

  async onModuleDestroy() {
    await this.redis.quit();
  }
}
