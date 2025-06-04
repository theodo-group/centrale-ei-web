import express from 'express';
import axios from 'axios';
import Movie from './entities/movie.js';
import { appDataSource } from './datasource.js';

const router = express.Router();

const KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo'; 

async function fetchPopularMovies(page = 1) {
  const url = `https://api.themoviedb.org/3/movie/popular?page=${page}`;
  const response = await axios.get(url, {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${KEY}`,
    },
  });
  return response.data.results;
}

router.get('/seed', async (req, res) => {
  const movieRepo = appDataSource.getRepository(Movie);
  await movieRepo.clear();

  // Seed films
  for (let page = 1; page <= 10; page++) {
    const movies = await fetchPopular('movie', page);
    for (const m of movies) {
      const movie = {
        type: 'movie',
        title: m.title || null,
        year: m.release_date || null,
        overview: m.overview || null,
        poster_path: m.poster_path || null,
        genre_ids: Array.isArray(m.genre_ids) ? m.genre_ids.join(',') : null,
        vote_average: m.vote_average ?? null,
      };
      await movieRepo.insert(movie);
    }
  }

  // Seed séries TV
  for (let page = 1; page <= 10; page++) {
    const shows = await fetchPopular('tv', page);
    for (const s of shows) {
      const show = {
        type: 'tv',
        title: s.name || null,
        year: s.first_air_date || null,
        overview: s.overview || null,
        poster_path: s.poster_path || null,
        genre_ids: Array.isArray(s.genre_ids) ? s.genre_ids.join(',') : null,
        vote_average: s.vote_average ?? null,
      };
      await movieRepo.insert(show);
    }
  }

  res.status(200).json({ message: 'Base films et séries remplie avec succès !' });
});


export default router;
