import express from 'express';
import * as path from 'path';
import { getChampionBySeasons } from './services/f1/f1.service';


const app = express();

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api', async (req, res) => {
  const pop = await getChampionBySeasons(2005);

  res.send({ message: pop });
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
