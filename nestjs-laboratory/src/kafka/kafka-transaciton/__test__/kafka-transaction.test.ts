import { Test, TestingModule } from '@nestjs/testing';
import { ClientKafka } from '@nestjs/microservices';
import { KafkaConfigModule } from '../../../producer-consumer/producer-consumer.module';
import { ConfigModule } from '../../../config/config.module';
import { KafkaModule } from '../../kafka.module';
import { ContentRepository } from '../content-repository';
import { KafkaTransactionService } from '../kafka-transaction.service';
import { Symbols } from '../../../symbols';

describe('정확히 한 번 전송 테스트', () => {
  let contentRepository: ContentRepository;
  let kafkaTxService: KafkaTransactionService;
  let idempotentKafkaProducer: ClientKafka;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [KafkaModule, ConfigModule],
    }).compile();

    idempotentKafkaProducer = app.get(Symbols.kafkaIdempotentProducer);

    contentRepository = app.get(ContentRepository);
    kafkaTxService = app.get(KafkaTransactionService);
  });

  afterAll(async () => {
    await idempotentKafkaProducer.close();
  });

  test('실패 시 message consume이 되어서는 안된다.', async () => {
    //TODO 전송 성공시 consume이 두 번되는 이유 추적
    //mock error
    jest.spyOn(contentRepository, 'save').mockRejectedValue(new Error('DB Error'));

    await kafkaTxService.atomicSend('this is atomic message');
  });
});
