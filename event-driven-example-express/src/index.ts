import express, { Express, Request, Response } from 'express';

const app: Express = express();
const port = 4000;

(async () => {
  app.get('/', (req: Request, res: Response) => {
    res.send('Typescript + Node.js + Express Server');
  });

  app.listen(port, () => {
    console.log(`[server]: Server is running at <https://localhost>:${port}`);
  });
})();
