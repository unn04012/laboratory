import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka, EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { Symbols } from '../symbols';

@Controller()
export class ConsumerController implements OnModuleInit {
  constructor(@Inject(Symbols.kafkaService) private readonly kafkaClient: ClientKafka) {}

  onModuleInit() {
    this.kafkaClient.subscribeToResponseOf('peter-kafka01');
  }

  @EventPattern('peter-kafka01')
  async consumeMessage(@Payload() message: string) {
    console.log('Received message:', message);
  }

  @MessagePattern('peter-kafka01')
  async consumeMessageRequestResponse(@Payload() message: string) {
    const msg = `Received Sync message: ${message}`;

    return msg;
  }
}
