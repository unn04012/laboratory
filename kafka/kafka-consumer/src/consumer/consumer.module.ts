import { Module } from '@nestjs/common';
import { ConsumerController } from './consumer.service';

@Module({
  controllers: [ConsumerController],
})
export class ConsumerModule {}
