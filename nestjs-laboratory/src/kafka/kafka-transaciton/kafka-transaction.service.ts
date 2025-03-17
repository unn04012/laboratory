import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Producer } from 'kafkajs';
import { ContentRepository } from './content-repository';
import { Symbols } from '../../symbols';

@Injectable()
export class KafkaTransactionService {
  constructor(@Inject(Symbols.kafkaConsumer) private readonly kafkaClient: ClientKafka, private readonly _contentRepository: ContentRepository) {
    console.log(this.kafkaClient);
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
