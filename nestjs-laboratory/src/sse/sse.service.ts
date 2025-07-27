import { Injectable } from '@nestjs/common';
import { Observable, concatMap, delay, from, interval, map, of } from 'rxjs';

export interface SSEMessage {
  id: number;
  event?: string;
  data: any;
  timestamp: string;
}

@Injectable()
export class SseService {
  constructor() {}

  // 300자 길이의 샘플 데이터 생성
  private generateSampleData(length: number = 300): string {
    const sampleText =
      '안녕하세요. 이것은 서버 전송 이벤트(SSE) 테스트를 위한 한글 샘플 텍스트입니다. 실시간 데이터 스트리밍 성능을 측정하기 위해 충분한 길이의 문장을 생성하고 있습니다. 한글 텍스트는 UTF-8 인코딩으로 전송되며, 각 문자는 영문보다 더 많은 바이트를 차지합니다. 이를 통해 실제 운영 환경에서 발생할 수 있는 다양한 문자 인코딩 상황을 시뮬레이션할 수 있습니다. 네트워크 대역폭과 서버 처리 성능을 정확히 측정하기 위한 목적으로 작성된 테스트 데이터입니다. ';

    let result = '';
    while (result.length < length) {
      result += sampleText;
    }

    return result.substring(0, length);
  }

  // 긴 텍스트를 청크 단위로 분할하는 함수
  private splitTextIntoChunks(text: string, chunkSize: number): string[] {
    const chunks: string[] = [];
    for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push(text.substring(i, i + chunkSize));
    }
    return chunks;
  }

  // 방법 1: 긴 텍스트를 청크로 나누어 순차 전송
  createDataStream(chunkSize: number = 300, intervalMs: number = 1000): Observable<SSEMessage> {
    let messageId = 1;

    // 전체 텍스트 생성
    const fullText = this.generateSampleData(300);
    // 청크로 분할
    const chunks = this.splitTextIntoChunks(fullText, chunkSize);

    return from(chunks).pipe(
      concatMap((chunk, index) =>
        of({
          id: messageId++,
          event: 'chunk',
          data: {
            chunk: chunk,
            chunkIndex: index + 1,
            totalChunks: chunks.length,
            chunkSize: chunk.length,
            isLast: index === chunks.length - 1,
          },
          timestamp: new Date().toISOString(),
        }).pipe(delay(intervalMs)),
      ),
    );
  }

  // 하트비트 스트림 생성 (간격 조절 가능)
  createHeartbeatStream(intervalMs: number = 5000): Observable<SSEMessage> {
    let id = 1;

    return interval(intervalMs).pipe(
      map(() => ({
        id: id++,
        event: 'heartbeat',
        data: {
          status: 'alive',
          intervalMs: intervalMs,
        },
        timestamp: new Date().toISOString(),
      })),
    );
  }

  // 다양한 이벤트 타입 스트림 생성 (청크 사이즈 및 간격 조절 가능)
  createMultiEventStream(chunkSize: number = 300, intervalMs: number = 1500): Observable<SSEMessage> {
    let counter = 1;

    return interval(intervalMs).pipe(
      map(() => {
        const eventType = counter % 3 === 0 ? 'notification' : 'data';

        return {
          id: counter++,
          event: eventType,
          data: {
            type: eventType,
            content: this.generateSampleData(chunkSize),
            priority: eventType === 'notification' ? 'high' : 'normal',
            chunkSize: chunkSize,
            intervalMs: intervalMs,
          },
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }

  // 연결 확인용 초기 메시지
  getWelcomeMessage(): SSEMessage {
    return {
      id: 0,
      event: 'connected',
      data: {
        message: 'Connected to SSE stream',
        server: 'NestJS',
      },
      timestamp: new Date().toISOString(),
    };
  }

  // 사용자 입력 대기 메시지
  getWaitingMessage(): SSEMessage {
    return {
      id: 0,
      event: 'waiting-input',
      data: {
        message: '사용자 입력을 기다리고 있습니다',
        instruction: '메시지를 입력하고 전송 버튼을 클릭하세요',
      },
      timestamp: new Date().toISOString(),
    };
  }

  public async createInteractiveStream(userInput: string, chunkSize: number = 300): Promise<Observable<SSEMessage>> {
    let messageId = 1;

    // 사용자 입력을 분석하여 응답 생성
    const responses = this.splitTextIntoChunks(this.generateSampleData(300), chunkSize);
    // this.generateInteractiveResponses(userInput, chunkSize);

    return new Observable((subscriber) => {
      // 즉시 확인 메시지 전송
      subscriber.next({
        id: messageId++,
        event: 'user-input-received',
        data: {
          userInput: userInput,
          status: 'processing',
          totalResponses: responses.length,
        },
        timestamp: new Date().toISOString(),
      });

      // 각 응답을 1초 간격으로 전송
      responses.forEach((response, index) => {
        setTimeout(() => {
          if (!subscriber.closed) {
            subscriber.next({
              id: messageId++,
              event: 'response',
              data: {
                responseIndex: index + 1,
                totalResponses: responses.length,
                content: response,
                userInput: userInput,
                chunkSize: response.length,
              },
              timestamp: new Date().toISOString(),
            });

            // 마지막 응답 후 완료 신호
            if (index === responses.length - 1) {
              setTimeout(() => {
                if (!subscriber.closed) {
                  subscriber.next({
                    id: messageId++,
                    event: 'response-complete',
                    data: {
                      userInput: userInput,
                      status: 'completed',
                      totalResponses: responses.length,
                    },
                    timestamp: new Date().toISOString(),
                  });
                }
              }, 500);
            }
          }
        }, (index + 1) * 1000);
      });
    });
  }

  // 사용자 입력에 따른 대화형 응답 생성
  private generateInteractiveResponses(userInput: string, chunkSize: number): string[] {
    const responses: string[] = [];

    // 입력 내용에 따라 다른 응답 생성
    if (userInput.includes('안녕') || userInput.includes('hello')) {
      responses.push(this.generateSampleData(chunkSize).replace(/안녕하세요/, `안녕하세요! "${userInput}"라고 말씀해주셨군요.`));
      responses.push(this.generateSampleData(chunkSize).replace(/이것은/, '반가워요! 이것은'));
    } else if (userInput.includes('테스트')) {
      responses.push(this.generateSampleData(chunkSize).replace(/테스트/, `"${userInput}" 키워드로 테스트`));
      responses.push(this.generateSampleData(chunkSize).replace(/성능/, '사용자 입력 기반 성능'));
      responses.push(this.generateSampleData(chunkSize).replace(/데이터/, '맞춤형 응답 데이터'));
    } else if (userInput.includes('긴') || userInput.includes('길게')) {
      // 긴 응답 요청 시 여러 개의 청크로 나누어 전송
      for (let i = 0; i < 5; i++) {
        responses.push(this.generateSampleData(chunkSize).replace(/샘플/, `긴 응답 ${i + 1}번째 샘플`));
      }
    } else if (userInput.length === 0) {
      responses.push(this.generateSampleData(chunkSize).replace(/안녕하세요/, '빈 입력을 받았습니다'));
    } else {
      // 기본 응답
      responses.push(this.generateSampleData(chunkSize).replace(/안녕하세요/, `"${userInput}"에 대한 응답입니다`));
      responses.push(this.generateSampleData(chunkSize).replace(/테스트/, '사용자 맞춤 테스트'));
    }

    return responses;
  }
}
