import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { kafkaConsumerConfig } from './config/kafka.config';

async function bootstrap() {
  const port = process.env.PORT ?? process.argv[2] ?? 3002;
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice(kafkaConsumerConfig);
  await app.startAllMicroservices();
  await app.listen(port);
}
bootstrap();
