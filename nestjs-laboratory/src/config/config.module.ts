import { Module } from '@nestjs/common';
import { Symbols } from '../symbols';
import { ConfigReader } from './config-reader';
import { RedisConfig } from './config-redis';
import { AwsSQSConfig } from './config.aws-sqs';
import { MySQLConfig } from './config.mysql';

@Module({
  providers: [
    {
      provide: Symbols.configReader,
      useClass: ConfigReader,
    },
    MySQLConfig,
    AwsSQSConfig,
    RedisConfig,
  ],
  exports: [MySQLConfig, AwsSQSConfig, RedisConfig],
})
export class ConfigModule {}
