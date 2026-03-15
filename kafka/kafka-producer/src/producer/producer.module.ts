import { Module } from '@nestjs/common';
import { KAFKA_PRODUCER } from '../config/symbols';
import { KafkajsProducerService } from './kafkajs-producer.service';
import { ProducerController } from './producer.controller';

@Module({
  controllers: [ProducerController],
  providers: [
    {
      provide: KAFKA_PRODUCER,
      useClass: KafkajsProducerService,
    },
  ],
  exports: [KAFKA_PRODUCER],
})
export class ProducerModule {}
