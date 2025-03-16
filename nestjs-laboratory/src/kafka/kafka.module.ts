import { Module } from '@nestjs/common';
import { KafkaTransactionController } from './kafka-transaciton/kafka-transaction.controller';
import { KafkaTransactionService } from './kafka-transaciton/kafka-transaction.service';
import { ContentRepository } from './kafka-transaciton/content-repository';
import { KafkaConfigModule } from '../producer-consumer/producer-consumer.module';
import { ClientsModule } from '@nestjs/microservices';
import { Symbols } from '../symbols';
import { ConfigModule } from '../config/config.module';
import { KafkaConfig } from '../config/config-kafka';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: Symbols.kafkaProducer,
        imports: [ConfigModule],
        inject: [KafkaConfig],
        useFactory: (config: KafkaConfig) => {
          return config.defaultConsumerKafkaOption;
        },
      },
      {
        name: Symbols.kafkaIdempotentProducer,
        imports: [ConfigModule],
        inject: [KafkaConfig],
        useFactory: (config: KafkaConfig) => {
          return config.defaultKafkaIdempotentProducerOption;
        },
      },
      {
        name: Symbols.kafkaConsumer,
        imports: [ConfigModule],
        inject: [KafkaConfig],
        useFactory: (config: KafkaConfig) => {
          return config.defaultConsumerKafkaOption;
        },
      },
    ]),
  ],
  // p],
  controllers: [KafkaTransactionController],
  providers: [KafkaTransactionService, ContentRepository],
})
export class KafkaModule {}
