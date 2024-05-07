import { Module } from '@nestjs/common';
import { SqsModule } from '@ssut/nestjs-sqs';
import { SqsOptions, SqsConsumerOptions } from '@ssut/nestjs-sqs/dist/sqs.types';

import { ConfigModule } from '../config/config.module';
import { AwsSQSConfig } from '../config/config.aws-sqs';
import { ExternalEventGatewayService } from './external-event-gateway';

export function sqsConfigurationFactory(queueConfig: AwsSQSConfig): SqsOptions {
  const consumerOpt: SqsConsumerOptions = {
    name: queueConfig.queueName,
    queueUrl: queueConfig.queueUrl,
    region: 'ap-northeast-2',
  };

  return {
    consumers: [consumerOpt],
  };
}

@Module({
  imports: [
    ConfigModule,
    SqsModule.registerAsync({
      imports: [ConfigModule],
      inject: [AwsSQSConfig],
      useFactory: (queueConfig: AwsSQSConfig) => sqsConfigurationFactory(queueConfig),
    }),
  ],
  providers: [ConfigModule, ExternalEventGatewayService],
  exports: [ExternalEventGatewayService],
})
export class EventModule {}
