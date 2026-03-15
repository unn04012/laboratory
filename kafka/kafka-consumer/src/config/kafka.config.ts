import { KafkaOptions, Transport } from '@nestjs/microservices';

const configurations = () => ({
  kafka: {
    host: process.env.KAFKA_HOST ?? 'localhost',
    port: process.env.KAFKA_PORT ?? '9092',
  },
});

export const kafkaConsumerConfig: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: 'consumer-app',
      brokers: [`${configurations().kafka.host}:${configurations().kafka.port}`],
    },
    consumer: {
      groupId: 'consumer-group',
      allowAutoTopicCreation: true,
      retry: {
        retries: 3,
        initialRetryTime: 1000,
      },
      sessionTimeout: 90000,
      heartbeatInterval: 15000,
      maxBytesPerPartition: 64 * 1024,
      maxWaitTimeInMs: 3000,
    },
  },
};
