import express from 'express';
import * as path from 'path';
import { shared } from '@nextjs-expressjs-postgre-sql/shared';


const app = express();

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api', (req, res) => {
  const pop = shared();
  res.send({ message: pop });
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
