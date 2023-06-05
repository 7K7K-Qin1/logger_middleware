import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CacheService } from './cache.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private cacheService: CacheService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const timestamp = new Date().toISOString();
    const userAgent = req.headers['user-agent'] || '';
    const logEntry = { ip, timestamp, userAgent };
    const logEntryJson = JSON.stringify(logEntry);

    await this.cacheService.rpush('logs', logEntryJson);

    next();
  }
}



//第二版 可以运行，但是没有写入文件
// import { Injectable, NestMiddleware } from '@nestjs/common';
// import { Request, Response, NextFunction } from 'express';
// import { CacheService } from './cache.service';

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



// 第一版
// import { Injectable, NestMiddleware } from '@nestjs/common';
// import { Request, Response, NextFunction } from 'express';
// import * as fs from 'fs';
// export class LoggerMiddleware implements NestMiddleware {
//   private readonly logFileStream = fs.createWriteStream('log.json', { flags: 'a' });

//   use(req: Request, res: Response, next: NextFunction) {
//     const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
//     const timestamp = new Date().toISOString();
//     const userAgent = req.headers['user-agent'] || '';

//     const logEntry = { ip, timestamp, userAgent };
//     const logEntryJson = JSON.stringify(logEntry) + '\n';
//     this.logFileStream.write(logEntryJson);

//     next();
//   }

//   async close() {
//     await new Promise<void>((resolve, reject) => {
//       this.logFileStream.end(err => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve();
//         }
//       });
//     });
//   }
// }
