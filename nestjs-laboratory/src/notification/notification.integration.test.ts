import { SQSClient, CreateQueueCommand, SendMessageCommand } from '@aws-sdk/client-sqs';
import { S3Client, CreateBucketCommand, HeadBucketCommand } from '@aws-sdk/client-s3';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Test } from '@nestjs/testing';
import { LocalstackContainer, StartedLocalStackContainer } from '@testcontainers/localstack';
import { ConfigModule } from '../config/config.module';
import { ExternalEventGatewayService } from '../events/external-event-gateway';

describe('notification module test', () => {
  let localStackContainer: StartedLocalStackContainer;
  let sqsClient: SQSClient;
  let queueUrl: string;
  let eventGatewayService: ExternalEventGatewayService;
  beforeAll(async () => {
    // const port = 5350;
    // localStackContainer = await new LocalstackContainer().withExposedPorts(port).start();
    // sqsClient = new SQSClient({
    //   region: 'us-east-1',
    //   endpoint: `http://${localStackContainer.getHost()}:${localStackContainer.getMappedPort(port)}`,
    // });
    // const createQueueCommand = new CreateQueueCommand({ QueueName: 'test-queue' });
    // const createQueueResult = await sqsClient.send(createQueueCommand);
    // if (!createQueueResult.QueueUrl) {
    //   throw new Error(`not created sqs queue url`);
    // }
    // console.log('create queue, url: ', queueUrl);
    // queueUrl = createQueueResult.QueueUrl;
    // const module = await Test.createTestingModule({
    //   imports: [ConfigModule, EventEmitterModule.forRoot()],
    //   providers: [ExternalEventGatewayService],
    // }).compile();
    // eventGatewayService = module.get(ExternalEventGatewayService);
  });

  //   test('sqs로 ORDER_CREATE 이벤트가 발생하면 내부 이벤트인 ORDER_CREATED 이벤트가 발행된다', async () => {
  //     const body = JSON.stringify({ kind: 'ORDER_CREATE' });
  //     const sendCommand = new SendMessageCommand({ QueueUrl: queueUrl, MessageBody: body });

  //     await sqsClient.send(sendCommand);

  //     const mocked = jest.spyOn(eventGatewayService, 'onExternalMessageArrival');

  //     expect(mocked).toHaveBeenCalled();
  //   });

  it('should create a S3 bucket', async () => {
    const port = 5350;
    const container = await new LocalstackContainer().withExposedPorts(port).start();

    const client = new SQSClient({
      region: 'us-east-1',
      endpoint: container.getConnectionUri(),
    });

    const createQueueCommand = new CreateQueueCommand({
      QueueName: 'test-queue',
      Attributes: {
        DelaySeconds: '60',
        MessageRetentionPeriod: '86400',
      },
    });

    const createQueueResult = await client.send(createQueueCommand);

    console.log(createQueueResult);

    // expect(createQueueResult.$metadata.httpStatusCode).toBe(200);

    await container.stop();
  });
});
