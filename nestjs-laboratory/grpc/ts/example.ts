// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.3.0
//   protoc               unknown
// source: example.proto

/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "example";

/** 요청 메시지 */
export interface Request {
  id: string;
}

/** 응답 메시지 */
export interface Response {
  message: string;
}

export const EXAMPLE_PACKAGE_NAME = "example";

/** gRPC 서비스 정의 */

export interface ExampleServiceClient {
  getExample(request: Request, metadata: Metadata, ...rest: any): Observable<Response>;

  /** 스트리밍 예시 */

  streamExample(request: Request, metadata: Metadata, ...rest: any): Observable<Response>;
}

/** gRPC 서비스 정의 */

export interface ExampleServiceController {
  getExample(request: Request, metadata: Metadata, ...rest: any): Promise<Response> | Observable<Response> | Response;

  /** 스트리밍 예시 */

  streamExample(request: Request, metadata: Metadata, ...rest: any): Observable<Response>;
}

export function ExampleServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["getExample", "streamExample"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("ExampleService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("ExampleService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const EXAMPLE_SERVICE_NAME = "ExampleService";