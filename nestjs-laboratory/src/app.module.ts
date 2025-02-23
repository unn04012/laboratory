import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { NotificationModule } from './notification/notification.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from './config/config.module';
import { MySQLConfig } from './config/config.mysql';
import { dataSourceFactory, dataSourceOptionsFactory } from './infrastructure/typeorm-factory';
import { EventModule } from './events/event.module';
import { EmployeeModule } from './employee/employee.module';
import { KafkaModule } from './producer-consumer/producer-consumer.module';
import { GrpcModule } from './grpc/grpc.module';

@Module({
  imports: [
    EmployeeModule,
    ConfigModule,
    NotificationModule,
    GrpcModule,
    EventEmitterModule.forRoot({
      wildcard: false,
      delimiter: '.',
      newListener: true,
      removeListener: false,
      verboseMemoryLeak: false,
      ignoreErrors: false,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [MySQLConfig],
      useFactory: dataSourceOptionsFactory,
      dataSourceFactory: dataSourceFactory,
    }),
    // RedisModule,
    // ProductModule,
    EventModule,
    KafkaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
