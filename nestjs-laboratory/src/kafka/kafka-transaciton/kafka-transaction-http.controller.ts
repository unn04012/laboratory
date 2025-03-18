import { Body, Controller, Post } from '@nestjs/common';
import { KafkaTransactionService } from './kafka-transaction.service';

@Controller()
export class KafkaTransactionHTTPController {
  constructor(private readonly _kafkaTransactionService: KafkaTransactionService) {}
  @Post('atomic-send')
  public async atomicSend(@Body() dto: { content: string }) {
    await this._kafkaTransactionService.atomicSend(dto.content);
  }

  @Post('emit-send')
  public async emitSend(@Body() dto: { content: string }) {
    await this._kafkaTransactionService.emit(dto.content);
  }
}
