import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { OpenApiModule } from './swagger/swagger.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  OpenApiModule.setupSwagger(app, {
    title: 'My API',
    description: 'API Documentation',
    version: '1.0.0',
    path: 'api',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
