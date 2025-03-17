import { Global, Module } from '@nestjs/common';
import { Symbols } from '../../symbols';
import { KafkaConfig } from '../../config/config-kafka';
import { ConfigModule } from '../../config/config.module';
import { Kafka } from 'kafkajs';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: Symbols.kafkaProducer,
      inject: [KafkaConfig],
      useFactory: async (config: KafkaConfig) => {
        const kafka = new Kafka(config.defaultKafkaIdempotentProducerOption);
        const producer = kafka.producer();
        await producer.connect(); // ✅ Producer만 연결
        return producer;
      },
    },
  ],
  exports: [Symbols.kafkaProducer],
})
export class KafkaProducerModule {}
