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
    const count = await movieRepo.count();

    await movieRepo.clear();

    for (let page = 1; page <= 50; page++) {
      const movies = await fetchPopularMovies(page);

      for (const m of movies) {
        const movie = {
          title: m.title,
          year: m.release_date,
        };

        await movieRepo.save(movie);
      }
    }

    res.status(200).json({ message: 'Base de films remplie avec succès !' });
});

export default router;
