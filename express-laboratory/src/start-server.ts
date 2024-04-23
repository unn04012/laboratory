import express, { Express, Request, Response } from 'express';
import SSE from 'sse';
import { getConfigModule, initConfigModule } from './config';
import { finalErrorHandler } from './errors/error-handler';
import { initRepositores } from './init-repository';
import { initProductOrderRouter } from './product/product-order.router';
import { dataSourceFactory } from './typeorm/connection-factory';

export function startServer() {
  const app: Express = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/product', initProductOrderRouter());

  app.get('/', (req: Request, res: Response) => {
    res.send('Typescript + Node.js + Express Server');
  });

  app.get('/sse', (req: Request, res: Response) => {
    res.sendFile(__dirname + '/views/sse.html');
  });

  app.get('/sse-connection', (req: Request, res: Response) => {
    res.sendFile(__dirname + '/views/sse.html');
  });

  app.use(finalErrorHandler());

  return app;
}

(async () => {
  initConfigModule();

  await dataSourceFactory(getConfigModule('mysqlConfig'));
  initRepositores();
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
