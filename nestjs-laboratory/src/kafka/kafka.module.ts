import { Module } from '@nestjs/common';
import { KafkaTransactionController } from './kafka-transaciton/kafka-transaction.controller';
import { KafkaTransactionService } from './kafka-transaciton/kafka-transaction.service';
import { ContentRepository } from './kafka-transaciton/content-repository';
import { KafkaConfigModule } from '../producer-consumer/producer-consumer.module';
import { ClientsModule } from '@nestjs/microservices';
import { Symbols } from '../symbols';
import { ConfigModule } from '../config/config.module';
import { KafkaConfig } from '../config/config-kafka';
import { KafkaTransactionHTTPController } from './kafka-transaciton/kafka-transaction-http.controller';
import { KafkaClientModule } from './kafka-client/kafka-client.module';

@Module({
  // p],
  controllers: [KafkaTransactionController, KafkaTransactionHTTPController],
  providers: [KafkaTransactionService, ContentRepository],
})
export class KafkaModule {}
