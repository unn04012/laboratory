import 'dotenv/config';
import 'reflect-metadata';
import express, { Request, Response, NextFunction, Express } from 'express';
import { initConfigModule } from './config/config.module';
import { initFileModule } from './modules/file';
import { fileRouter } from './modules/file/presentation/http/routes/file.routes';
import { ValidationFailedError } from './shared/errors/validation.error';

export function createApp(): Express {
  // 모듈 초기화 (순서 중요)
  initConfigModule();
  initFileModule();

  const app = express();

  // JSON 파싱은 특정 라우트에만 적용 (스트림 업로드 라우트 제외)
  // 또는 전체 적용 후 스트림 라우트만 express.raw() 사용
  app.use(express.json());

  // Routes
  app.use('/api/files', fileRouter);

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Error handler
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);

    if (err instanceof ValidationFailedError) {
      return res.status(400).json({
        error: 'Validation Failed',
        message: err.message,
      });
    }

    res.status(500).json({
      error: 'Internal Server Error',
      message: err.message,
    });
  });

  return app;
}

// 로컬 실행 시
if (process.env.NODE_ENV !== 'lambda') {
  const PORT = process.env.PORT || 3000;
  const app = createApp();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
