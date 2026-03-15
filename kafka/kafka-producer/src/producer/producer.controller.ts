import { Body, Controller, Inject, Post } from '@nestjs/common';
import { IKafkaProducer } from './interfaces/kafka-producer.interface';
import { KAFKA_PRODUCER } from '../config/symbols';

class OrderMessageDto {
  key?: string;
  message: string;
}

@Controller('orders')
export class ProducerController {
  constructor(@Inject(KAFKA_PRODUCER) private readonly producer: IKafkaProducer) {}

  @Post()
  async createOrder(@Body() dto: OrderMessageDto) {
    await this.producer.send('order', [{ value: dto.message }]);
    return { success: true };
  }
}
