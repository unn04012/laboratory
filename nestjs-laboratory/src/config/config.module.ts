import { Module } from '@nestjs/common';
import { Symbols } from '../symbols';
import { ConfigReader } from './config-reader';
import { RedisConfig } from './config-redis';
import { TokenConfig } from './config-token';
import { AwsSQSConfig } from './config.aws-sqs';
import { MySQLConfig } from './config.mysql';
import { KafkaConfig } from './config-kafka';

@Module({
  providers: [
    {
      provide: Symbols.configReader,
      useClass: ConfigReader,
    },
    MySQLConfig,
    AwsSQSConfig,
    RedisConfig,
    TokenConfig,
    KafkaConfig,
  ],
  exports: [MySQLConfig, AwsSQSConfig, RedisConfig, TokenConfig, KafkaConfig],
})
export class ConfigModule {}
