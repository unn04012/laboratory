import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HelloService } from './hello/hello.service';

@Module({
  imports: [],
  controllers: [AppController, HelloService],
  providers: [AppService],
})
export class AppModule {}
