import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { LoggerMiddleware } from './logger.middleware';
import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import * as redisStore from 'cache-manager-redis-store';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CacheService } from './cache.service';

    @Module({
      imports: [
        CacheModule.register({
          store: redisStore,
          socket: {
            host: parseInt(process.env.REDIS_CLI),
            port: parseInt(process.env.REDIS_PORT),
          },
        }),
      ],
      controllers: [AppController],
      providers: [
        AppService,
        LoggerMiddleware,
        CacheService,
        {
          provide: APP_INTERCEPTOR,
          useClass: CacheInterceptor,
        },
      ],
    })
    export class AppModule {
      configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*');
      }
    }