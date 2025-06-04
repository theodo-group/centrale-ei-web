import 'dotenv/config';
import { DataSource } from 'typeorm';

export const appDataSource = new DataSource({
  type: 'sqlite',
  database: process.env.DATABASE_NAME || './data/sqlite.db',
  synchronize: false,
  entities: ['entities/*.js'],
  migrations: ['migrations/*.js'],
  cli: {
    migrationsDir: 'migrations',
  },
});
