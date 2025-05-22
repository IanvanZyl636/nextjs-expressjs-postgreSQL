import express from 'express';
import f1Router from './routers/f1.router';
import { checkDBConnection } from './integrations/prisma';

const app = express();

app.use('/api', f1Router);

const port = process.env.PORT || 3333;
const server = app.listen(port, async ()=> {
  await checkDBConnection();

  console.log(`🚀 Server started on http://localhost:${port}`);
});
server.on('error', console.error);
