import { Partitioners } from 'kafkajs';

const configurations = () => ({
  kafka: {
    host: process.env.KAFKA_HOST ?? 'localhost',
    port: process.env.KAFKA_PORT ?? '9092',
  },
});

export const kafkaProducerConfig = {
  client: {
    clientId: 'producer-app',
    brokers: [`${configurations().kafka.host}:${configurations().kafka.port}`],
  },
  producer: {
    createPartitioner: Partitioners.DefaultPartitioner,
    allowAutoTopicCreation: true,
    idempotent: true,
  },
};
