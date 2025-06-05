import { DataSource } from 'typeorm';
import 'dotenv/config';
//import Movie from './entities/movies.js'; // Import explicite de l'entité
// Importe ici toutes tes entités nécessaires, par ex. Genre si tu l'as
// import Genre from './entities/genres.js';

export const appDataSource = new DataSource({
  type: 'sqlite',
  database: process.env.DATABASE_NAME,
  synchronize: false,
  logging: true,
  //entities: [Movie /*, Genre, ...*/],
  entities: ['entities/*.js'],
  migrations: ['migrations/*.js'],
  cli: {
    migrationsDir: 'migrations',
  },
});
