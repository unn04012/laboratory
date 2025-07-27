import { Controller, Get, Post, Res, Query, Body, ParseIntPipe } from '@nestjs/common';
import { Response } from 'express';
import { SseService, SSEMessage } from './sse.service';
import { Subscription } from 'rxjs';

@Controller('sse')
export class SseController {
  private activeConnections = new Map<string, { res: Response; subscription?: Subscription }>();

  constructor(private readonly sseService: SseService) {}

  // 기본 SSE 엔드포인트 - 청크 사이즈 및 간격 조절 가능
  @Get('events')
  async events(
    @Res() res: Response,
    @Query('chunkSize', new ParseIntPipe({ optional: true })) chunkSize: number = 300,
    @Query('interval', new ParseIntPipe({ optional: true })) interval: number = 2000,
  ): Promise<void> {
    // 파라미터 유효성 검사
    const validatedChunkSize = Math.min(Math.max(chunkSize, 10), 10000); // 10~10000자 제한
    const validatedInterval = Math.min(Math.max(interval, 100), 60000); // 100ms~60초 제한

    // SSE 헤더 설정
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control',
    });

    // 연결 확인을 위한 초기 메시지 전송
    const welcomeMessage = this.sseService.getWelcomeMessage();
    welcomeMessage.data = {
      ...welcomeMessage.data,
      chunkSize: validatedChunkSize,
      interval: validatedInterval,
    };
    this.sendSSEMessage(res, welcomeMessage);

    // 데이터 스트림 구독
    const subscription = this.sseService.createDataStream(validatedChunkSize, validatedInterval).subscribe({
      next: (message) => {
        this.sendSSEMessage(res, message);
        console.log(`Message ${message.id} sent (${validatedChunkSize} chars, ${validatedInterval}ms interval)`);
      },
      error: (error) => {
        console.error('Error in data stream:', error);
        this.closeConnection(res, subscription);
      },
    });

    // 클라이언트 연결 해제 시 정리
    this.handleConnectionCleanup(res, subscription);
  }

  // 하트비트 전용 엔드포인트 - 간격 조절 가능
  @Get('heartbeat')
  async heartbeat(@Res() res: Response, @Query('interval', new ParseIntPipe({ optional: true })) interval: number = 5000): Promise<void> {
    const validatedInterval = Math.min(Math.max(interval, 1000), 60000); // 1초~60초 제한

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    });

    const subscription = this.sseService.createHeartbeatStream(validatedInterval).subscribe({
      next: (message) => {
        this.sendSSEMessage(res, message);
        console.log(`Heartbeat sent (${validatedInterval}ms interval)`);
      },
      error: (error) => {
        console.error('Error in heartbeat stream:', error);
        this.closeConnection(res, subscription);
      },
    });

    this.handleConnectionCleanup(res, subscription);
  }

  // 다양한 이벤트 타입을 전송하는 엔드포인트 - 청크 사이즈 및 간격 조절 가능
  @Get('multi-events')
  async multiEvents(
    @Res() res: Response,
    @Query('chunkSize', new ParseIntPipe({ optional: true })) chunkSize: number = 300,
    @Query('interval', new ParseIntPipe({ optional: true })) interval: number = 1500,
  ): Promise<void> {
    const validatedChunkSize = Math.min(Math.max(chunkSize, 10), 10000);
    const validatedInterval = Math.min(Math.max(interval, 100), 60000);

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    });

    const subscription = this.sseService.createMultiEventStream(validatedChunkSize, validatedInterval).subscribe({
      next: (message) => {
        this.sendSSEMessage(res, message);
        console.log(`Multi-event ${message.data.type} sent (${validatedChunkSize} chars, ${validatedInterval}ms interval)`);
      },
      error: (error) => {
        console.error('Error in multi-event stream:', error);
        this.closeConnection(res, subscription);
      },
    });

    this.handleConnectionCleanup(res, subscription);
  }

  // SSE 메시지 전송 헬퍼 메서드
  private sendSSEMessage(res: Response, message: SSEMessage): void {
    try {
      res.write(`id: ${message.id}\n`);
      if (message.event) {
        res.write(`event: ${message.event}\n`);
      }
      res.write(
        `data: ${JSON.stringify({
          ...message.data,
          timestamp: message.timestamp,
        })}\n\n`,
      );
    } catch (error) {
      console.error('Error sending SSE message:', error);
    }
  }

  // 대화형 SSE 엔드포인트 - 사용자 입력 후 응답
  @Get('interactive')
  async interactive(
    @Res() res: Response,
    @Query('clientId') clientId: string = `client_${Date.now()}`,
    @Query('chunkSize', new ParseIntPipe({ optional: true })) chunkSize: number = 300,
  ): Promise<void> {
    const validatedChunkSize = Math.min(Math.max(chunkSize, 10), 10000);

    // SSE 헤더 설정
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control',
    });

    // 클라이언트 연결 저장
    this.activeConnections.set(clientId, { res });

    // 연결 확인 및 대기 메시지 전송
    const welcomeMessage = this.sseService.getWelcomeMessage();
    welcomeMessage.data = { ...welcomeMessage.data, clientId, chunkSize: validatedChunkSize };
    this.sendSSEMessage(res, welcomeMessage);

    const waitingMessage = this.sseService.getWaitingMessage();
    this.sendSSEMessage(res, waitingMessage);

    console.log(`Interactive SSE connection established for client: ${clientId}`);

    // 클라이언트 연결 해제 시 정리
    res.on('close', () => {
      console.log(`Client ${clientId} disconnected`);
      this.activeConnections.delete(clientId);
    });

    res.on('error', (err) => {
      console.error(`SSE connection error for client ${clientId}:`, err);
      this.activeConnections.delete(clientId);
    });
  }

  // 사용자 입력 처리 엔드포인트
  @Post('send-message')
  async sendMessage(@Body() body: { clientId: string; message: string; chunkSize?: number }): Promise<{ success: boolean; message: string }> {
    const { clientId, message, chunkSize = 300 } = body;

    if (!clientId || !this.activeConnections.has(clientId)) {
      return { success: false, message: 'Client not found or not connected' };
    }

    const connection = this.activeConnections.get(clientId);
    if (!connection) {
      return { success: false, message: 'Invalid connection' };
    }

    const validatedChunkSize = Math.min(Math.max(chunkSize, 10), 10000);

    try {
      // 기존 구독이 있다면 해제
      if (connection.subscription) {
        connection.subscription.unsubscribe();
      }

      // 새로운 응답 스트림 구독
      const subscription = (await this.sseService.createInteractiveStream(message, validatedChunkSize)).subscribe({
        next: (sseMessage) => {
          this.sendSSEMessage(connection.res, sseMessage);
        },
        error: (error) => {
          console.error(`Error in interactive stream for client ${clientId}:`, error);
          this.sendSSEMessage(connection.res, {
            id: Date.now(),
            event: 'error',
            data: { error: 'Stream processing error' },
            timestamp: new Date().toISOString(),
          });
        },
        complete: () => {
          console.log(`Interactive stream completed for client ${clientId}`);
          // 완료 후 다시 대기 상태로
          setTimeout(() => {
            if (this.activeConnections.has(clientId)) {
              const waitingMessage = this.sseService.getWaitingMessage();
              this.sendSSEMessage(connection.res, waitingMessage);
            }
          }, 1000);
        },
      });

      // 구독 저장
      connection.subscription = subscription;

      console.log(`Message processed for client ${clientId}: "${message}"`);
      return { success: true, message: 'Message sent successfully' };
    } catch (error) {
      console.error(`Error processing message for client ${clientId}:`, error);
      return { success: false, message: 'Error processing message' };
    }
  }
  private handleConnectionCleanup(res: Response, subscription: Subscription): void {
    res.on('close', () => {
      console.log('Client disconnected');
      subscription.unsubscribe();
    });

    res.on('error', (err) => {
      console.error('SSE connection error:', err);
      subscription.unsubscribe();
    });
  }

  // 연결 종료 헬퍼 메서드
  private closeConnection(res: Response, subscription: Subscription): void {
    subscription.unsubscribe();
    if (!res.destroyed) {
      res.end();
    }
  }
}
