import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: false,
  });

  const isMcpMode = process.env.MCP_SERVER !== 'false';

  if (isMcpMode) {
    await app.init();
    // MCP 서버 모드: STDIO로 통신, 포트 리스닝 없음

    console.error('MCP Server started - waiting for connections...');

    // NestJS 앱은 초기화되지만 HTTP 서버는 시작하지 않음
    // McpService가 onModuleInit에서 STDIO 연결을 시작함
  } else {
    // 일반 HTTP 서버 모드
    await app.listen(process.env.PORT ?? 3000);
    console.log(`HTTP Server running on port ${process.env.PORT ?? 3000}`);
  }
  return app;
}

bootstrap().catch(console.error);
