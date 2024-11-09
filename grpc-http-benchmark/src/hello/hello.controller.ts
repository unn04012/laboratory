import { Controller, Get, OnModuleInit } from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { Observable } from 'rxjs';

interface HelloService {
  sayHello(data: { name: string }): Observable<{ message: string }>;
}

@Controller('hello')
export class HelloController implements OnModuleInit {
  @Client({
    transport: Transport.GRPC,
    options: {
      package: 'hello',
      protoPath: join(__dirname, 'hello.proto'),
    },
  })
  private client: ClientGrpc;

  private helloService: HelloService;

  onModuleInit() {
    this.helloService = this.client.getService<HelloService>('HelloService');
  }

  @Get(':name')
  sayHello(name: string) {
    return this.helloService.sayHello({ name });
  }
}
