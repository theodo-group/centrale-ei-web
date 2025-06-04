import 'reflect-metadata';
import { appDataSource } from '../datasource.js';
import Movie from '../entities/movies.js';
import Genre from '../entities/genres.js';

async function addMovie(movieData) {
  await appDataSource.initialize();
  const movieRepository = appDataSource.getRepository(Movie);

  try {
    const newMovie = movieRepository.create(movieData);
    const savedMovie = await movieRepository.save(newMovie);
    console.log('Movie successfully created, id:', savedMovie.id);
  } catch (error) {
    console.error('Error while creating the movie:', error.message);
    if (error.code === 'SQLITE_CONSTRAINT' || error.code === '23505') {
      console.error(`Movie with id "${movieData.id}" already exists`);
    }
  } finally {
    await appDataSource.destroy();
  }
}

//Exemple 1 : avec id
const movieWithId = {
  id: 123,
  title: 'Film Avec ID',
  releaseDate: new Date('2024-01-01'),
};

//Exemple 2 : sans id (auto-incrémenté)
const movieWithoutId = {
  title: 'Film Sans ID',
  releaseDate: new Date('2025-01-01'),
};

//Tester les deux ajouts
async function run() {
  console.log('--- Ajout avec id explicite ---');
  await addMovie(movieWithId);

  console.log('\n--- Ajout sans id (auto-généré) ---');
  await addMovie(movieWithoutId);
}

run();
