import { Body, Controller } from '@nestjs/common';
import { KafkaTransactionService } from './kafka-transaction.service';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class KafkaTransactionController {
  constructor(private readonly _service: KafkaTransactionService) {}

  @EventPattern('atomic-topic')
  public async atomicSend(@Body() dto: { content: string }) {
    console.log(`kafka successfully consumed!!, value: ${JSON.stringify(dto)}`);
  }
}
