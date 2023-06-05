// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import * as dotenv from 'dotenv';
// dotenv.config();

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   await app.listen(3000);
// }
// bootstrap();

export { AppController } from './app.controller';
export { AppService } from './app.service';
export { LoggerMiddleware } from './logger.middleware';
export { CacheService } from './cache.service';