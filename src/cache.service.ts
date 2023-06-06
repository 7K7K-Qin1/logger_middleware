// import { Injectable } from '@nestjs/common';
// import { CACHE_MANAGER, Inject } from '@nestjs/common';
// import { Cache } from 'cache-manager';
// import { Redis } from 'ioredis';
// import * as dotenv from 'dotenv';
// dotenv.config();

   
// @Injectable()
// export class CacheService {
//   private redisClient: Redis;

//   constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
//     this.redisClient = new Redis({
//       host: process.env.REDIS_CLI,
//       port: parseInt(process.env.REDIS_PORT),
//       keyPrefix: 'nestjs-cache:',
//     })
//   }

//   async get(key: string): Promise<string> {
//     return await this.cacheManager.get(key);
//   }

//   async set(key: string, value: string): Promise<void> {
//     await this.cacheManager.set(key, value);
//   }

//   async rpush(key: string, value: string): Promise<void> {
//     await this.redisClient.rpush(key, value);
//     // 设置过期时间为1分钟
//     const result = await this.redisClient.expire(key, 60);
//   }

//   async lrange(key: string, start: number, stop: number): Promise<string[]> {
//     return await this.redisClient.lrange(key, start, stop);
//   }
// }
import { Injectable } from '@nestjs/common';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Redis } from 'ioredis';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class CacheService {
  private redisClient: Redis;
  private defaultTTL: number = 10; // 默认TTL值为60秒

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    this.redisClient = new Redis({
      host: process.env.REDIS_CLI,
      port: parseInt(process.env.REDIS_PORT),
      keyPrefix: 'nestjs-cache:',
    });
  }

  async get(key: string): Promise<string> {
    return await this.cacheManager.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    const cacheTTL = ttl || this.defaultTTL; // 如果未传递ttl参数，则使用默认值
    await this.cacheManager.set(key, value, { ttl: cacheTTL });
  }

  async rpush(key: string, value: string, ttl?: number): Promise<void> {
    await this.redisClient.rpush(key, value);
    const cacheTTL = ttl || this.defaultTTL; // 如果未传递ttl参数，则使用默认值
    await this.redisClient.expire(key, cacheTTL);
  }

  async lrange(key: string, start: number, stop: number): Promise<string[]> {
    return await this.redisClient.lrange(key, start, stop);
  }

  setDefaultTTL(ttl: number): void {
    this.defaultTTL = ttl;
  }
}
