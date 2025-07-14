import { DynamicModule, Module } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export interface SwaggerConfig {
  title?: string;
  description?: string;
  version?: string;
  path?: string;
  tags?: string[];
}

export interface SwaggerAsyncConfig {
  useFactory: (...args: any[]) => Promise<SwaggerConfig> | SwaggerConfig;
  inject?: any[];
}

export class OpenApiModule {
  // static forRoot(config: SwaggerConfig): DynamicModule {
  //   return {
  //     module: OpenApiModule,
  //     providers: [
  //       {
  //         provide: 'SWAGGER_CONFIG',
  //         useValue: config,
  //       },
  //     ],
  //     exports: ['SWAGGER_CONFIG'],
  //   };
  // }

  // static forRootAsync(config: SwaggerAsyncConfig): DynamicModule {
  //   return {
  //     module: OpenApiModule,
  //     providers: [
  //       {
  //         provide: 'SWAGGER_CONFIG',
  //         useFactory: config.useFactory,
  //         inject: config.inject || [],
  //       },
  //     ],
  //     exports: ['SWAGGER_CONFIG'],
  //   };
  // }

  static setupSwagger(app: INestApplication, config: SwaggerConfig): void {
    const options = new DocumentBuilder()
      .setTitle(config.title || 'API Documentation')
      .setDescription(config.description || 'API Description')
      .setVersion(config.version || '1.0.0');

    if (config.tags) {
      config.tags.forEach((tag) => options.addTag(tag));
    }

    const document = SwaggerModule.createDocument(app, options.build());
    SwaggerModule.setup(config.path || 'api', app, document);
  }
}
