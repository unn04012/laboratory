import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';
import { IKafkaProducer, KafkaMessage } from './interfaces/kafka-producer.interface';
import { kafkaProducerConfig } from '../config/kafka.config';

@Injectable()
export class KafkajsProducerService implements IKafkaProducer, OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkajsProducerService.name);
  private readonly kafka: Kafka;
  private readonly producer: Producer;

  constructor() {
    this.kafka = new Kafka(kafkaProducerConfig.client);
    this.producer = this.kafka.producer(kafkaProducerConfig.producer);
  }

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  async connect(): Promise<void> {
    await this.producer.connect();
    this.logger.log('Kafka producer connected');
  }

  async disconnect(): Promise<void> {
    await this.producer.disconnect();
    this.logger.log('Kafka producer disconnected');
  }

  async send(topic: string, messages: KafkaMessage[]): Promise<void> {
    await this.producer.send({
      topic,
      messages: messages.map((m) => ({
        key: m.key ?? null,
        value: m.value,
        headers: m.headers,
      })),
    });
    this.logger.log(`Sent ${messages.length} message(s) to topic "${topic}"`);
  }
}
