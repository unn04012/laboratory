import { NestFactory } from '@nestjs/core';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path/posix';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { EXAMPLE_PACKAGE_NAME } from '../grpc/ts/example';
import { AppModule } from './app.module';
import { KafkaConfig } from './config/config-kafka';

async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.create(AppModule);

  const kafkaConfig = app.get(KafkaConfig);
  app.connectMicroservice(kafkaConfig.defaultConsumerKafkaOption);

  // app.connectMicroservice<GrpcOptions>({
  //   transport: Transport.GRPC,
  //   options: {
  //     url: `0.0.0.0:${7700}`,
  //     package: [EXAMPLE_PACKAGE_NAME],
  //     protoPath: [join(__dirname, '../grpc/proto', 'example.proto')],
  //     loader: {
  //       enums: String,
  //       objects: true,
  //       arrays: true,
  //     },
  //   },
  // });

  await app.startAllMicroservices();

  const config = new DocumentBuilder().setTitle('Cats example').setDescription('The cats API description').setVersion('1.0').addTag('cats').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(4000);
}
bootstrap();
