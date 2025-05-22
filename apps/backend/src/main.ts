import { initializeDB } from './integrations/prisma';
import { initializeExpress } from './integrations/expressjs';

(async () => {
  await initializeDB();
  await initializeExpress();
})()

