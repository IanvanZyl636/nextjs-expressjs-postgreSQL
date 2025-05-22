import express from 'express';
import f1Router from '../../routers/f1.router';
import errorLogger from '../../middleware/error-logger.middleware';

export const initializeExpress = async () => new Promise<void>(resolve => {
  const app = express();

  app.use(express.json());
  app.use('/api', f1Router);
  app.use(errorLogger);

  const port = process.env.PORT || 3333;
  const server = app.listen(port, async ()=> {
    console.log(`🚀 Server started on http://localhost:${port}`);
  });
  server.on('error', console.error);
  resolve();
});

