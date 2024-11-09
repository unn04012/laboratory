import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

interface HelloRequest {
  name: string;
}

interface HelloResponse {
  message: string;
}

@Controller()
export class HelloService {
  @GrpcMethod('HelloService', 'sayHello')
  sayHello(data: HelloRequest): HelloResponse {
    return { message: `Hello, ${data.name}!` };
  }
}
