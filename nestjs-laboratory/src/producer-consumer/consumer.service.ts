import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka, MessagePattern } from '@nestjs/microservices';
import { Symbols } from '../symbols';

@Injectable()
export class ConsumerService {
  constructor(@Inject(Symbols.kafkaService) private readonly kafkaClient: ClientKafka) {}
}
