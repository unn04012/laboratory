import sse from 'k6/x/sse';
import { check } from 'k6';

import { Counter, Rate } from 'k6/metrics';

export const options = {
  duration: '5s',
  vus: 1,
  thresholds: {
    sse_error_rate: ['rate<0.1'], // 에러율 10% 미만
    sse_errors_total: ['count<5'], // 총 에러 5개 미만
  },
};

// 커스텀 메트릭 정의
const sseErrors = new Counter('sse_errors_total');
const sseErrorRate = new Rate('sse_error_rate');
const sseConnections = new Counter('sse_connections_total');
const sseEvents = new Counter('sse_events_total');

export default function () {
  const url = 'http://localhost:3000/sse/events?chunkSize=20&interval=500';
  const params = {
    method: 'GET',
    // headers: {
    //   Authorization: 'Bearer XXXX',
    // },
    tags: { my_k6s_tag: 'hello sse' },
  };

  const response = sse.open(url, params, function (client) {
    client.on('open', function open() {
      console.log('connected');
    });

    client.on('event', function (event) {
      console.log(`event id=${event.id}, name=${event.name}, data=${event.data}`);
      if (parseInt(event.id) === 4) {
        client.close();
      }
    });

    client.on('error', function (e) {
      console.log('An unexpected error occurred: ', e.error());
      errorOccurred = true;

      // 에러 메트릭 수집
      sseErrors.add(1, {
        error_type: 'sse_error',
        error_message: e.error(),
      });
      sseErrorRate.add(true);
      sseConnections.add(1, { status: 'error' });
    });
  });

  const checks = check(response, {
    'status is 200': (r) => r && r.status === 200,
    'connection established': () => connectionSuccess,
    'no errors occurred': () => !errorOccurred,
    'received events': () => eventCount > 0,
  });
}
