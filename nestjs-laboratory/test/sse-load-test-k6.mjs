// ===== k6 버전 (간단) =====
// 파일: sse-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Rate } from 'k6/metrics';

const sseConnections = new Counter('sse_connections');
const sseConnectionSuccess = new Rate('sse_connection_success_rate');

export const options = {
  vus: 1,
  duration: '10s',
};

function connectSse(chunkSize = 20) {
  const response = http.get(`http://localhost:3000/sse/events?chunkSize=${chunkSize}&interval=500`, {
    headers: {
      Accept: 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Content-Type': 'text/event-stream',
    },
    timeout: '5s',
  });

  return response;
}

export default function () {
  // 1. 기본 SSE 연결
  const response = connectSse(20);
  console.log(JSON.stringify(response));

  sseConnections.add(1);
  // 2. 검증
  const success = check(response, {
    'SSE connected': (r) => r.status === 200,
    // 'correct content type': (r) => r.headers['Content-Type'].includes('text/event-stream'),
  });

  if (success) {
    // 3. SSE 데이터 처리
    const messageCount = parseSSEMessages(response.body);
    console.log(`Received ${messageCount} SSE messages`);
  }

  sleep(1);
}

function parseSSEMessages(body) {
  if (!body) return [];

  const messages = [];
  const lines = body.split('\n');
  let currentMessage = {};

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith('id:')) {
      currentMessage.id = trimmedLine.substring(3).trim();
    } else if (trimmedLine.startsWith('event:')) {
      currentMessage.event = trimmedLine.substring(6).trim();
    } else if (trimmedLine.startsWith('data:')) {
      currentMessage.data = trimmedLine.substring(5).trim();
    } else if (trimmedLine === '' && currentMessage.data) {
      try {
        const parsedData = JSON.parse(currentMessage.data);
        messages.push({
          ...currentMessage,
          parsedData: parsedData,
        });

        // 로깅
        const isLast = parsedData.isLast || false;
        const eventType = currentMessage.event || 'message';
        console.log(`📨 ID:${currentMessage.id} Event:${eventType} isLast:${isLast}`);
      } catch (e) {
        messages.push({ ...currentMessage, parsedData: null });
      }
      currentMessage = {};
    }
  }

  return messages;
}
