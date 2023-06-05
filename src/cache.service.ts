import { Injectable } from '@nestjs/common';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Redis } from 'ioredis';
import * as dotenv from 'dotenv';
dotenv.config();

   
@Injectable()
export class CacheService {
  private redisClient: Redis;

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    this.redisClient = new Redis({
      host: process.env.REDIS_CLI,
      port: parseInt(process.env.REDIS_PORT),
      keyPrefix: 'nestjs-cache:',
    })
  }

  async get(key: string): Promise<string> {
    return await this.cacheManager.get(key);
  }

  async set(key: string, value: string): Promise<void> {
    // ttl设置为1分钟
    const ttl = 60;
    await this.cacheManager.set(key, value, { ttl });
  }

  async rpush(key: string, value: string): Promise<void> {
    await this.redisClient.rpush(key, value);
    // 设置过期时间为1分钟
    const result = await this.redisClient.expire(key, 60);
  }

  async lrange(key: string, start: number, stop: number): Promise<string[]> {
    return await this.redisClient.lrange(key, start, stop);
  }
}

// 第二版 正式

// import { Injectable } from '@nestjs/common';
// import { CACHE_MANAGER, Inject } from '@nestjs/common';
// import { Cache } from 'cache-manager';
// import { Redis } from 'ioredis';

// @Injectable()
// export class CacheService {
//   private redisClient: Redis;

//   constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
//     this.redisClient = new Redis({
//       host: 'localhost',
//       port: 6379,
//       keyPrefix: 'nestjs-cache:',
//     });
//   }

//   async get(key: string): Promise<string> {
//     return await this.cacheManager.get(key);
//   }

//   async set(key: string, value: string): Promise<void> {
//     // ttl设置为1分钟
//     const ttl = 60;
//     await this.cacheManager.set(key, value, { ttl });
//   }

//   async rpush(key: string, value: string): Promise<void> {
//     await this.redisClient.rpush(key, value);
//     // 设置过期时间为1个月
//     await this.redisClient.expire(key, 60);
//   }

//   async lrange(key: string, start: number, stop: number): Promise<string[]> {
//     return await this.redisClient.lrange(key, start, stop);
//   }
// }



//可运行的版本 v1.0.0
// import { Injectable } from '@nestjs/common';
// import { CACHE_MANAGER, Inject } from '@nestjs/common';
// import { Cache } from 'cache-manager';

// @Injectable()
// export class CacheService {
//   constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

//   async get(key: string): Promise<string> {
//     return await this.cacheManager.get(key);
//   }

//   async set(key: string, value: string): Promise<void> {
//     await this.cacheManager.set(key, value);
//   }
// }
