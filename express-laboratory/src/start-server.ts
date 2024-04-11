import express, { Express, Request, Response } from 'express';
import SSE from 'sse';

export function startServer() {
  const app: Express = express();

  app.get('/', (req: Request, res: Response) => {
    res.send('Typescript + Node.js + Express Server');
  });

  app.get('/sse', (req: Request, res: Response) => {
    res.sendFile(__dirname + '/views/sse.html');
  });

  app.get('/sse-connection', (req: Request, res: Response) => {
    res.sendFile(__dirname + '/views/sse.html');
  });

  return app;
}

(async () => {
  const app = startServer();
  const port = 4000;

  const server = app.listen(port, () => {
    console.log(`[server]: Server is running at <https://localhost>:${port}`);
  });

  const sse = new SSE(server);
  sse.on('connection', (client) => {
    setInterval(() => {
      // 1초마다 클라이언트에 데이터 전송
      client.send(Date.now().toString()); // 문자열만 보낼 수 있음
    }, 1000);
  });
})();
