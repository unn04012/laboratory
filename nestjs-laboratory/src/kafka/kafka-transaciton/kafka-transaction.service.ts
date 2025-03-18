import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ContentRepository } from './content-repository';
import { Symbols } from '../../symbols';

@Injectable()
export class KafkaTransactionService {
  constructor(@Inject(Symbols.kafkaClient) private readonly kafkaClient: ClientKafka, private readonly _contentRepository: ContentRepository) {}

  public async emit(content: string) {
    this.kafkaClient.emit('atomic-topic', content);
  }

  public async atomicSend(content: string) {
    const producer = await this.kafkaClient.connect();
    const tx = await producer.transaction();

    try {
      await tx.send({
        topic: 'atomic-topic',
        messages: [{ value: content }],
      });

      await this._contentRepository.save(content);

      await tx.commit();
      console.log('kafka tx commit successfully');
    } catch (err) {
      await tx.abort();
      console.log('kafka tx abort successfully');
    }
  }
}
