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
    console.error('Error while creating the movie:', error);
    // Gestion d'erreur similaire au routeur
    if (error.code === 'SQLITE_CONSTRAINT' || error.code === '23505') {
      console.error(`Movie with id "${movieData.id}" already exists`);
    }
  } finally {
    await appDataSource.destroy();
  }
}

// Exemple d'appel
const movieToAdd = {
  id: 123, // Tu peux passer l'id ici si tu veux fixer celui de TMDB
  title: 'Mon Film Test',
  releaseDate: new Date('2024-01-01'),
};

addMovie(movieToAdd);
