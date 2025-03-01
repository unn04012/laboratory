import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Symbols } from '../symbols';
import { ConsumerController } from './consumer.controller';
import { ConsumerService } from './consumer.service';
import { ProducerController } from './producer.controller';
import { ProducerService } from './producer.service';
import { KafkaConfig } from '../config/config-kafka';
import { ConfigModule } from '../config/config.module';

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
  providers: [ProducerService, ConsumerService],
  controllers: [ProducerController, ConsumerController],
})
export class KafkaModule {}
