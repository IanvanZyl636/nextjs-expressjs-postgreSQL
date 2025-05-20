import { Prisma, PrismaClient } from './generated';

const prisma = new PrismaClient();

export default prisma.$extends({
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        if (operation !== 'upsert' || !model) {
          return query(args);
        }

        try {
          return await query(args);
        } catch (error) {
          if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            (error.code === 'P2002' ||
              error.message.includes('Unique constraint failed'))
          ) {
            const client = prisma as Record<string, any>;

            const existing = await client[model].findUnique({
              where: args.where,
            });

            if (!existing)
              throw new Error(
                `Race condition for ${model} args:${args.toString()}`
              );

            return existing;
          }

          throw error;
        }
      },
    },
  },
});
