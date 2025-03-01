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

  test('정확히 한번 전송 걸리는 시간', async () => {
    const emitEvent = async (i: number) => {
      return await lastValueFrom(idempotentKafkaProducer.emit<RecordMetadata>('test-topic', { order: i }));
    };

    const tasks = Array.from({ length: 100 }, (_, i) => i);

    console.time('idempotentProducer');
    for (const task of tasks) {
      await emitEvent(task);
    }
    console.timeEnd('idempotentProducer'); // 19455 ms
  });

  test('걸리는 시간', async () => {
    const emitEvent = async (i: number) => {
      return await lastValueFrom(defaultKafkaProducer.emit<RecordMetadata>('test-topic', { order: i }));
    };

    const tasks = Array.from({ length: 100 }, (_, i) => i);

    console.time('idempotentProducer');

    await Promise.all(tasks.map(emitEvent));
    console.timeEnd('idempotentProducer'); //3409 ms
  });

  test('정확히 한번 전송 걸리는 시간 (최적화)', async () => {
    const emitEvent = async (i: number) => {
      return await lastValueFrom(idempotentKafkaProducer.emit<RecordMetadata>('test-topic', { order: i }));
    };

    const tasks = Array.from({ length: 100 }, (_, i) => i);

    console.time('idempotentProducer');
    await Promise.all(tasks.map(emitEvent)); // 3448
    console.timeEnd('idempotentProducer');
  });

  test.only('배치 전송 (최적화)', async () => {
    const producer = await idempotentKafkaProducer.connect();
    const emitEvent = async (i: number[]) => {
      const messages: Message[] = i.map((e) => ({ value: String(e) }));
      console.log(JSON.stringify(messages));
      return await producer.send({
        // 여러번 보낸다.
        acks: -1,
        timeout: 1000,
        topic: 'test-topic',
        messages,
      });
    };

    const emitEventByKafkaClient = async (i: number[]) => {
      return defaultKafkaProducer.emit<RecordMetadata>('test-topic', i);
    };

    const tasks = Array.from({ length: 100 }, (_, i) => i);

    const chunkedTasks = chunk(tasks, 6);

    console.time('idempotentProducer');
    for (const chunkedTask of chunkedTasks) {
      await emitEventByKafkaClient(chunkedTask);
      //   emitEventByKafkaClient(chunkedTask).then(() => console.timeEnd('idempotentProducer'));
      //   console.log(result);
    }
    console.timeEnd('idempotentProducer');
  });
});
