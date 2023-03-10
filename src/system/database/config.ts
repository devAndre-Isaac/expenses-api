import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config();

const { DB_HOST, DB_PORT, DB_PASSWORD, DB_NAME, DB_USER } = process.env;

export const dbEnv = {
  type: 'postgres',
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  entities: [`${path.resolve(__dirname, '../..')}/**/*.entity.{ts,js}`],
};
