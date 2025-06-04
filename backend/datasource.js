import { DataSource } from 'typeorm';
import Movie from './entities/movies.js';
import Genre from './entities/genres.js';
import dotenv from 'dotenv';

dotenv.config();

export const appDataSource = new DataSource({
  type: 'sqlite',
  database: process.env.DATABASE_NAME,
  synchronize: false,
  entities: [Movie, Genre],
  migrations: ['migrations/*.js'],
  cli: {
    migrationsDir: 'migrations',
  },
});