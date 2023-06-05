import { CACHE_MANAGER, Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import { CacheService } from './cache.service';

// @Injectable()
// export class LoggerMiddleware implements NestMiddleware {
//   constructor(private cacheService: CacheService) {}

//   async use(req: Request, res: Response, next: NextFunction) {
//     const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
//     const timestamp = new Date().toISOString();
//     const userAgent = req.headers['user-agent'] || '';
//     const logEntry = { ip, timestamp, userAgent };
//     const logEntryJson = JSON.stringify(logEntry);

//     await this.cacheService.set('log', logEntryJson);

//     next();
//   }
// }



@Injectable()
export class AppService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async getHello() {
    await this.cacheManager.set('cached_item', { key: 32 }, { ttl: 10 });
    await this.cacheManager.del('cached_item');
    await this.cacheManager.reset();
    const cachedItem = await this.cacheManager.get('cached_item');
    console.log(cachedItem);
    return 'test time';
  }
}
