import { SQSClient, CreateQueueCommand, SendMessageCommand } from '@aws-sdk/client-sqs';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Test } from '@nestjs/testing';
import { SqsModule } from '@ssut/nestjs-sqs';
import { LocalstackContainer, StartedLocalStackContainer } from '@testcontainers/localstack';
import { GenericContainer } from 'testcontainers';

import { AwsSQSConfig } from '../config/config.aws-sqs';
import { ConfigModule } from '../config/config.module';
import { EventModule, sqsConfigurationFactory } from '../events/event.module';
import { ExternalEventGatewayService } from '../events/external-event-gateway';

describe('notification module test', () => {
  let localStackContainer: StartedLocalStackContainer;
  let sqsClient: SQSClient;
  let queueUrl: string;
  let eventGatewayService: ExternalEventGatewayService;

  beforeAll(async () => {
    const port = 5350;
    const queueName = 'test-queue';
    localStackContainer = await new LocalstackContainer('localstack/localstack:3').withExposedPorts(port).start();

    // localStackContainer = await new GenericContainer('localstack/localstack').withEnvironment({ SERVICES: 'sqs' }).start();

    sqsClient = new SQSClient({
      region: 'ap-northeast-2',
      endpoint: localStackContainer.getConnectionUri(),
    });

    const createQueueCommand = new CreateQueueCommand({
      QueueName: queueName,
    });
    const createQueueResult = await sqsClient.send(createQueueCommand);

    if (!createQueueResult.QueueUrl) {
      throw new Error(`not created sqs queue url`);
    }

    queueUrl = createQueueResult.QueueUrl;

    const sqsQueue = <AwsSQSConfig>{
      queueName,
      queueUrl,
    };
    console.log(sqsQueue);

    const module = await Test.createTestingModule({
      imports: [
        ConfigModule,
        EventEmitterModule.forRoot(),
        // SqsModule.registerAsync({
        //   imports: [ConfigModule],
        //   inject: [AwsSQSConfig],
        //   useFactory: (queueConfig: AwsSQSConfig) => sqsConfigurationFactory(queueConfig),
        // }),
        EventModule,
      ],
      providers: [ExternalEventGatewayService],
    })
      .overrideProvider(AwsSQSConfig)
      .useValue(sqsQueue)
      .compile();

    eventGatewayService = module.get(ExternalEventGatewayService);
  });

  afterAll(async () => {
    sqsClient.destroy();
    await localStackContainer.stop();
  });

  test('sqs로 ORDER_CREATE 이벤트가 들어올 경우 내부 이벤트인 ORDER_CREATED 이벤트가 발행된다', async () => {
    // const mocked = jest.spyOn(eventGatewayService, 'onExternalMessageArrival');

    const body = JSON.stringify({ kind: 'ORDER_CREATE' });
    const sendCommand = new SendMessageCommand({ QueueUrl: queueUrl, MessageBody: body });

    const sendResult = await sqsClient.send(sendCommand);

    // expect(mocked).toHaveBeenCalled();
  });
});
