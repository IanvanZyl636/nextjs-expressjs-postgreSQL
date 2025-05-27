import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

(async () => {
  const envPath = path.resolve(__dirname, '../.env');
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const parsedEnv = dotenv.parse(envContent);

  const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE, DB_PORT } = parsedEnv;

  const {
    TEST_DB_HOST,
    TEST_DB_USER,
    TEST_DB_PASSWORD,
    TEST_DB_DATABASE,
    TEST_DB_PORT,
  } = parsedEnv;

  await generateOrUpdateEnv(
    'DATABASE_URL',
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_PORT,
    DB_DATABASE
  );

  await generateOrUpdateEnv(
    'TEST_DATABASE_URL',
    TEST_DB_USER,
    TEST_DB_PASSWORD,
    TEST_DB_HOST,
    TEST_DB_PORT,
    TEST_DB_DATABASE
  );

  async function generateOrUpdateEnv(
    envKey: string,
    dbUser?: string,
    dbPassword?: string,
    dbHost?: string,
    dbPort?: string,
    dbDatabase?: string
  ) {
      const envPath = path.resolve(__dirname, '../.env');
      const envContent = fs.readFileSync(envPath, 'utf-8');
      const envLines = envContent.split('\n');

      if (!dbUser || !dbPassword || !dbHost || !dbPort || !dbDatabase) {
        throw new Error('❌ Missing one or more required DB_* variables.');
      }

      const newDatabaseUrl = `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbDatabase}`;

      let updated = false;
      const updatedLines = envLines.map((line) => {
        if (line.startsWith(`${envKey}=`)) {
          updated = true;
          return `${envKey}="${newDatabaseUrl}"`;
        }
        return line;
      });

      if (!updated) {
        updatedLines.push(`${envKey}="${newDatabaseUrl}"`);
        console.log(`✅ ${envKey} created.`);
      } else {
        console.log(`✅ ${envKey} updated.`);
      }

      fs.writeFileSync(envPath, updatedLines.join('\n'));
  }
})();
