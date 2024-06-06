import axios from 'axios';
import { DataSource, In } from 'typeorm';
import Movie from '../entities/movie.js';
import Genre from '../entities/genre.js';

export const appDataSource = new DataSource({
  type: 'sqlite',
  database: '../database.sqlite3',
  synchronize: false,
  entities: ['../entities/*.js'],
  migrations: ['migrations/*.js'],
  cli: {
    migrationsDir: 'migrations',
  },
});

await appDataSource.initialize();
console.log('Data Source has been initialized!');
const response_genres = await axios.get(
  'https://api.themoviedb.org/3/genre/movie/list?language=en',
  {
    headers: {
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo',
      accept: 'application/json',
    },
  }
);
const genres = response_genres.data.genres;
await appDataSource
  .createQueryBuilder()
  .insert()
  .into(Genre)
  .values(
    genres.map((genre) => ({
      id: genre.id,
      genre_name: genre.name,
    }))
  )
  .execute();

for (let page = 1; page < 50; page++) {
  const response_movies = await axios.get(
    `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`,
    {
      headers: {
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo',
        accept: 'application/json',
      },
    }
  );
  const films = response_movies.data.results;
  for (const movie of films) {
    const movieRepository = appDataSource.getRepository(Movie);
    const genreRepository = appDataSource.getRepository(Genre);
    const movieGenres = await genreRepository.find({
      where: { id: In(movie.genre_ids) },
    });
    const newMovie = movieRepository.create({
      id: movie.id,
      title: movie.title,
      release_date: movie.release_date,
      original_language: movie.original_language,
      overview: movie.overview,
      poster_path: movie.poster_path,
      popularity: movie.popularity,
      vote_average: movie.vote_average,
      genres: movieGenres,
    });
    movieRepository.save(newMovie);
  }
}
