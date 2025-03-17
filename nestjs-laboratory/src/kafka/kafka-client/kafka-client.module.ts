import { Global, Module } from '@nestjs/common';
import { KafkaTransactionController } from '../kafka-transaciton/kafka-transaction.controller';
import { KafkaTransactionService } from '../kafka-transaciton/kafka-transaction.service';
import { ContentRepository } from '../kafka-transaciton/content-repository';
import { KafkaConfigModule } from '../../producer-consumer/producer-consumer.module';
import { ClientKafka, ClientsModule } from '@nestjs/microservices';
import { Symbols } from '../../symbols';
import { ConfigModule } from '../../config/config.module';
import { KafkaConfig } from '../../config/config-kafka';
import { KafkaTransactionHTTPController } from '../kafka-transaciton/kafka-transaction-http.controller';

@Global()
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
        name: Symbols.kafkaClient,
        imports: [ConfigModule],
        inject: [KafkaConfig],
        useFactory: (config: KafkaConfig) => {
          return config.defaultConsumerKafkaOption;
        },
      },
    ]),
  ],

  exports: [ClientsModule],
})
export class KafkaClientModule {}
