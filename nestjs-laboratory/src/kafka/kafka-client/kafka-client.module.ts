import { Global, Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { Symbols } from '../../symbols';
import { ConfigModule } from '../../config/config.module';
import { KafkaConfig } from '../../config/config-kafka';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: Symbols.kafkaClient,
        imports: [ConfigModule],
        inject: [KafkaConfig],
        useFactory: (config: KafkaConfig) => {
          return config.defaultConsumerKafkaOption;
        },
      },
    ]),
  ],

  exports: [ClientsModule],
})
export class KafkaClientModule {}
