import { ErrorRequestHandler } from 'express';

export const finalErrorHandler = (): ErrorRequestHandler => (err, req, res, next) => {
  console.log(err);

  res.status(500).json({
    status: 500,
    text: err.message,
  });
};
