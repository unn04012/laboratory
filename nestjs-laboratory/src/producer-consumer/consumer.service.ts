import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka, MessagePattern } from '@nestjs/microservices';
import { Symbols } from '../symbols';

@Injectable()
export class ConsumerService {
  constructor(@Inject(Symbols.kafkaConsumer) private readonly kafkaClient: ClientKafka) {}
}
