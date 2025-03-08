import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '../../config/config.module';
import { KafkaModule } from '../producer-consumer.module';
import { ClientKafka } from '@nestjs/microservices';
import { Symbols } from '../../symbols';
import { lastValueFrom } from 'rxjs';
import { Message, RecordMetadata, TopicMessages } from 'kafkajs';
import { chunk } from 'lodash';

describe('정확히 한 번 전송 테스트', () => {
  let idempotentKafkaProducer: ClientKafka;
  let defaultKafkaProducer: ClientKafka;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule, KafkaModule],
    }).compile();

    idempotentKafkaProducer = app.get(Symbols.kafkaIdempotentProducer);
    defaultKafkaProducer = app.get(Symbols.kafkaProducer);
  });

  afterAll(async () => {
    await idempotentKafkaProducer.close();
    await defaultKafkaProducer.close();
  });

  test('nestjs ClientKafka 이용한 배열 전송', async () => {
    const emitEvent = async (i: number) => {
      return lastValueFrom(defaultKafkaProducer.emit<RecordMetadata>('test-topic', i));
    };

    const tasks = Array.from({ length: 1000 }, (_, i) => i);
    const chunkedTasks = chunk(tasks, 5);

    console.time('defaultKafkaProducer');
    for (const chunkedTask of chunkedTasks) {
      const promisedEvents = chunkedTask.map(emitEvent);
      const result = await Promise.all(promisedEvents);
    }
    console.timeEnd('defaultKafkaProducer'); // 3457 ms

    expect(1).toBe(1);
  });

  test('배치 전송 (최적화)', async () => {
    const producer = await defaultKafkaProducer.connect();
    const emitEvent = async (i: number[]) => {
      const messages: Message[] = i.map((e) => ({ value: String(e) }));

      return await producer.send({
        // 여러번 보낸다.
        acks: -1,
        timeout: 1000,
        topic: 'test-topic',
        messages,
      });
    };

    const tasks = Array.from({ length: 1000 }, (_, i) => i);

    const chunkedTasks = chunk(tasks, 5);

    console.time('defaultKafkaProducer');
    for (const chunkedTask of chunkedTasks) {
      const result = await emitEvent(chunkedTask);
    }
    console.timeEnd('defaultKafkaProducer');

    expect(1).toBe(1);
  });
});
