import { Injectable, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { Symbols } from '../symbols';

@Injectable()
export class ProducerService {
  constructor(@Inject(Symbols.kafkaIdempotentProducer) private readonly kafkaClient: ClientKafka) {}

  async produceMessage(message: string) {
    this.kafkaClient.emit('peter-kafka01', { value: message });
    console.log(`Message produced: ${message}`);
  }

  async produceMessageSynchronous(message: string) {
    const result = await lastValueFrom(this.kafkaClient.send('test-topic', { value: message }));
    console.log(result);
    return result;
  }

  async produceMessageTest(message: string) {
    const result = await lastValueFrom(this.kafkaClient.emit('test-topic', { value: message }));
    console.log(result);
    return result;
  }

  async produceBatch(message: string) {
    // const result = await
  }
}
