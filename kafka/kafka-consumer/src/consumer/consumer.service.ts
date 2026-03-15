import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload, Ctx } from '@nestjs/microservices';
import { KafkaContext } from '@nestjs/microservices';

@Controller()
export class ConsumerController {
  private readonly logger = new Logger(ConsumerController.name);

  @EventPattern('order')
  async handleOrderEvent(@Payload() message: any, @Ctx() context: KafkaContext) {
    const topic = context.getTopic();
    const partition = context.getPartition();
    const offset = context.getMessage().offset;
    this.logger.log(`[${topic}] partition=${partition} offset=${offset} value=${JSON.stringify(message)}`);
  }
  @EventPattern('order')
  async handleOrderEventThrowTest(@Payload() message: any, @Ctx() context: KafkaContext) {
    const topic = context.getTopic();
    const partition = context.getPartition();
    const offset = context.getMessage().offset;
    this.logger.log(`[${topic}] partition=${partition} offset=${offset} value=${JSON.stringify(message)}`);

    throw new Error('Test error');
  }
}
