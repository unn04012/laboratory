import { Metadata } from '@grpc/grpc-js';
import { Controller } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ExampleServiceController, ExampleServiceControllerMethods, Request, Response } from '../../grpc/ts/example';

@Controller()
@ExampleServiceControllerMethods()
export class GrpcController implements ExampleServiceController {
  public getExample(request: Request, metadata: Metadata, ...rest: any): Response | Promise<Response> | Observable<Response> {
    return { message: 'hello world' };
  }
  public streamExample(request: Request, metadata: Metadata, ...rest: any): Observable<Response> {
    throw new Error('Method not implemented.');
  }
}
