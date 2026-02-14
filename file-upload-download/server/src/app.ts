import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import { fileRouter } from './modules/file/presentation/http/routes/file.routes';
import { ValidationFailedError } from './shared/errors/validation.error';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Routes
app.use('/api/files', fileRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  if (err instanceof ValidationFailedError) {
    return res.status(400).json({
      error: 'Validation Failed',
      message: err.message,
    });
  }

  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
