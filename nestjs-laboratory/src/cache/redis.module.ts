import { Global, Module } from '@nestjs/common';

import { Symbols } from '../symbols';
import { redisConnectionFactory } from './redis-connection-factory';

export interface IRedisModuleOptions {
  host: string;
  port: number;
}

@Global()
@Module({
  providers: [
    {
      provide: Symbols.redisClient,
      useFactory: redisConnectionFactory,
    },
  ],
  exports: [Symbols.redisClient],
})
export class RedisModule {} //TODO make dynamic module
