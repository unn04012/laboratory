import { Test, TestingModule } from '@nestjs/testing';
import { ClientKafka, ClientsModule } from '@nestjs/microservices';
import { KafkaConfigModule } from '../../../producer-consumer/producer-consumer.module';
import { ConfigModule } from '../../../config/config.module';
import { KafkaModule } from '../../kafka.module';
import { ContentRepository } from '../content-repository';
import { KafkaTransactionService } from '../kafka-transaction.service';
import { Symbols } from '../../../symbols';
import { KafkaClientModule } from '../../kafka-client/kafka-client.module';

describe('정확히 한 번 전송 테스트', () => {
  let contentRepository: ContentRepository;
  let kafkaTxService: KafkaTransactionService;
  let kafkaClient: ClientKafka;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [KafkaModule, KafkaClientModule],
    }).compile();

    kafkaClient = app.get(Symbols.kafkaClient);

    contentRepository = app.get(ContentRepository);
    kafkaTxService = app.get(KafkaTransactionService);
  });

  afterAll(async () => {
    await kafkaClient.close();
  });

  test('실패 시 message consume이 되어서는 안된다.', async () => {
    //TODO 전송 성공시 consume이 두 번되는 이유 추적
    //mock error
    jest.spyOn(contentRepository, 'save').mockRejectedValue(new Error('DB Error'));

    await kafkaTxService.atomicSend('this is atomic message');
  });
});
