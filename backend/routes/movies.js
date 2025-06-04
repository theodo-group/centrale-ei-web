import express from 'express';
import axios from 'axios';
import Movie from '../entities/movie.js';
import { appDataSource } from '../datasource.js';

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

    for (let page = 1; page <= 20; page++) {
      const movies = await fetchPopularMovies(page);

      for (const m of movies) {
        const movie = {
          title: m.title,
          year: m.release_date,
        };
        await movieRepo.insert(movie);
      }
    }

    res.status(200).json({ message: 'Seed terminé avec succès.' });
});

router.get('/', async (req, res) => {
  try {
    const movieRepo = appDataSource.getRepository(Movie);
    const movies = await movieRepo.find();
    res.status(200).json({ movies });
  } catch (err) {
    console.error('Erreur lors de la récupération des films:', err);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des films.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const movieRepo = appDataSource.getRepository(Movie);
    const movie = await movieRepo.findOneBy({ id: parseInt(req.params.id) });

    if (!movie) {
      return res.status(404).json({ message: 'Film non trouvé' });
    }

    res.status(200).json({ movie });
  } catch (err) {
    console.error('Erreur lors de la récupération du film:', err);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération du film.' });
  }
});

export default router;
