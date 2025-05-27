import { PrismaClient } from '@nextjs-expressjs-postgre-sql/shared';

export const prisma = new PrismaClient({
  datasources:{
    db:{
      url:`postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`
    }
  }
});

export const initializeDB = async (): Promise<void> => {
  while (true) {
    try {
      await prisma.$connect();
      console.log('✅  Connected to the database.');
      break;
    } catch {
      console.error('❌  DB connection failed. Retrying in 3 seconds...');
      await new Promise(res => setTimeout(res, 3000));
    }
  }
};
