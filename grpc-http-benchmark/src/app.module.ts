import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HelloService } from './hello/hello.service';
import { HttpHelloController } from './hello/http-hello.controller';

@Module({
  imports: [],
  controllers: [AppController, HelloService, HttpHelloController],
  providers: [AppService],
})
export class AppModule {}
