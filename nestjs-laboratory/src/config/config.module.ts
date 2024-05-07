import { Module } from '@nestjs/common';
import { Symbols } from '../symbols';
import { ConfigReader } from './config-reader';
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
  ],
  exports: [MySQLConfig, AwsSQSConfig],
})
export class ConfigModule {}
