import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RedisClientType } from '@redis/client';
import Redis from 'ioredis';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { AppModule } from '../src/app.module';
import { Symbols } from '../src/symbols';
import { Observable, of, throwError, timer } from 'rxjs';
import { map, catchError, delay } from 'rxjs/operators';

async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.create(AppModule);
  return app;
}

class TestService {
  // 성공하는 Observable 메서드
  someMethod(): Observable<string> {
    return of('Hello Observable!').pipe(
      delay(1000),
      map((value) => `Result: ${value}`),
    );
  }

  // 에러 발생하는 Observable 메서드
  errorMethod(): Observable<string> {
    return throwError(() => new Error('Something went wrong!')).pipe(
      catchError((error) => {
        console.log('Error caught:', error.message);
        return of('Error handled');
      }),
    );
  }

  // 랜덤 성공/실패 Observable 메서드
  randomMethod(): Observable<string> {
    const isSuccess = Math.random() > 0.5;

    if (isSuccess) {
      return of('Random success!').pipe(delay(500));
    } else {
      return throwError(() => new Error('Random error occurred'));
    }
  }

  // 타이머 기반 Observable 메서드
  timerMethod(): Observable<number> {
    return timer(0, 1000).pipe(map((count) => count + 1));
  }
}

(async () => {
  console.log('Starting Observable Tests...\n');

  const testService = new TestService();

  try {
    testService.errorMethod().subscribe({
      next: (value) => console.log('Success:', value),
      error: (error) => console.log('Error:', error.message),
      complete: () => console.log('Completed\n'),
    });
  } catch (err) {
    console.log(err);
  }
})();
