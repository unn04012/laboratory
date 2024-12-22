import { Controller, Post, Body } from '@nestjs/common';
import { ProducerService } from './producer.service';

@Controller('producer')
export class ProducerController {
  constructor(private readonly producerService: ProducerService) {}

  @Post()
  async sendMessage(@Body('message') message: string) {
    await this.producerService.produceMessage(message);
    return { status: 'Message sent', message };
  }

  @Post('sync')
  async sendMessageSynchronous(@Body('message') message: string) {
    const result = await this.producerService.produceMessageSynchronous(message);
    return { status: result };
  }
}
