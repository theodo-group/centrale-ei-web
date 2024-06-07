import { getRepository } from 'typeorm';
import express from 'express';
import { Movie } from './entities/Movie';
import { Genre } from './entities/Genre';

const router = express.Router();

// Route to get all movies
router.get('/movies', async (req, res) => {
  try {
    const movieRepository = getRepository(Movie);
    const movies = await movieRepository.find({ relations: ['genres'] });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get all genres
router.get('/genres', async (req, res) => {
  try {
    const genreRepository = getRepository(Genre);
    const genres = await genreRepository.find({ relations: ['movies'] });
    res.json(genres);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get movies by genre ID
router.get('/genres/:id/movies', async (req, res) => {
  try {
    const genreId = req.params.id;
    const genreRepository = getRepository(Genre);
    const genre = await genreRepository.findOne(genreId, {
      relations: ['movies'],
    });

    if (!genre) {
      return res.status(404).json({ error: 'Genre not found' });
    }

    res.json(genre.movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
