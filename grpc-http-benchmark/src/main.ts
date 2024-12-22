import { ReflectionService } from '@grpc/reflection';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const httpApp = await NestFactory.create(AppModule);
  await httpApp.listen(3000); // HTTP 서버 포트

  const grpcApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'hello',
        protoPath: join(__dirname, 'hello/protos/hello.proto'),
        url: 'localhost:5000', // 포트 번호 설정
        onLoadPackageDefinition: (pkg, server) => {
          new ReflectionService(pkg).addToServer(server);
        },
      },
    },
  );

  await grpcApp.listen();
}
bootstrap();
