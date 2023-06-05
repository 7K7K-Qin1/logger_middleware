import { BadRequestException, CacheKey, CacheTTL, Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { CacheService } from './cache.service';
import {z} from "zod";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly cacheService: CacheService,
  ) {}

  @Get()
  @CacheKey('sample')
  @CacheTTL(5)
  async getHello() {
    return this.appService.getHello();
  }

  @Get('log')
  async getLog(@Query('start', ParseIntPipe) start: unknown, @Query('end', ParseIntPipe) end: unknown) {
    try {
    const verifiedStart = z.number().int().nonnegative().parse(start);
    const verifiedEnd = z.number().int().nonnegative().parse(end);
    const logs = await this.cacheService.lrange('logs', +start, +end);
    console.log('getLog',  logs.map((log) => JSON.parse(log)));
    return [ ...logs.map((log) => JSON.parse(log))];
    } catch (error) {
      // check if is zod error
      if (error.issues) {
        return new BadRequestException(error.issues);
      }
      throw error;
    }
  }
}
