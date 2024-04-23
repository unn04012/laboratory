import { ErrorRequestHandler } from 'express';

export const finalErrorHandler = (): ErrorRequestHandler => (err, req, res, next) => {
  console.log(err);

  res.json({
    status: 500,
    text: err.message,
  });
};
