import { PrismaClient } from './generated';

const prisma = new PrismaClient();

export const checkDBConnection = async (): Promise<void> => {
  while (true) {
    try {
      await prisma.$connect();
      console.log('✅  Connected to the database.');
      break;
    } catch (e) {
      console.error('❌  DB connection failed. Retrying in 3 seconds...');
      await new Promise(res => setTimeout(res, 3000));
    }
  }
};

export default prisma;
