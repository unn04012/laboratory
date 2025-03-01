import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka, Ctx, EventPattern, KafkaContext, MessagePattern, Payload } from '@nestjs/microservices';
import { Symbols } from '../symbols';

@Controller()
export class ConsumerController {
  constructor(@Inject(Symbols.kafkaConsumer) private readonly kafkaClient: ClientKafka) {}

  // onModuleInit() {
  //   this.kafkaClient.subscribeToResponseOf('peter-kafka01');
  // }

  @EventPattern('peter-kafka01')
  async consumeMessage(@Payload() message: string, @Ctx() context: KafkaContext) {
    console.log('Received at v1 message:', message);
  }

  @EventPattern('peter-kafka01')
  async consumeMessageV2(@Payload() message: string) {
    console.log('Received at v2 message:', message);
  }

  @EventPattern('test-topic')
  async testTopic(@Payload() message: string) {
    console.log('Received at test topic:', message);
  }

  // @MessagePattern('peter-kafka01')
  // async consumeMessageRequestResponse(@Payload() message: string) {
  //   const msg = `Received Sync message: ${message}`;

  //   return msg;
  // }
}
