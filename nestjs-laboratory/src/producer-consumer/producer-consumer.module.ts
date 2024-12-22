import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Symbols } from '../symbols';
import { ConsumerController } from './consumer.controller';
import { ConsumerService } from './consumer.service';
import { ProducerController } from './producer.controller';
import { ProducerService } from './producer.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: Symbols.kafkaService,
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'], // Kafka 브로커 주소
          },
          consumer: {
            groupId: 'peter-group', // Consumer 그룹 ID
          },
        },
      },
    ]),
  ],
  providers: [ProducerService, ConsumerService],
  controllers: [ProducerController, ConsumerController],
})
export class ProducerConsumerModule {}
