import express from 'express';
import { appDataSource } from '../datasource.js';
import Movie from '../entities/movie.js';

const router = express.Router();

router.get('/', function (req, res) {
  appDataSource
    .getRepository(Movie)
    .find({})
    .then(function (movies) {
      res.json({ movies: movies });
    });
});

router.get('/:id', function (req, res) {
  const movieId = parseInt(req.params.id);
  if (isNaN(movieId) || movieId <= 0) {
    return res.status(400).json({
      error: 'Invalid ID format',
      message: 'ID must be a positive number',
    });
  }
  const movieRepository = appDataSource.getRepository(Movie);
  movieRepository
    .findOneBy({ id: movieId })
    .then(function (movie) {
      if (!movie) {
        return res.status(404).json({
          error: 'Movie not found',
          message: `No movie found with ID ${movieId}`,
        });
      }
      res.status(200).json({
        message: 'Movie retrieved successfully',
        movie: movie,
      });
    })
    .catch(function (error) {
      console.error('Error fetching movie:', error);
      res.status(500).json({
        error: 'Database error',
        details: error.message,
      });
    });
});

router.post('/new', function (req, res) {
  const movieRepository = appDataSource.getRepository(Movie);
  const newMovie = movieRepository.create({
    title: req.body.title,
    release_date: req.body.release_date,
  });

  movieRepository
    .save(newMovie)
    .then(function (savedMovie) {
      res.status(201).json({
        message: 'Movie successfully created',
        id: savedMovie.id,
      });
    })
    .catch(function (error) {
      console.error(error);
      if (error.code === '23505') {
        res.status(400).json({
          message: `Movie with title "${newMovie.title}" already exists`,
        });
      } else {
        res.status(500).json({ message: 'Error while creating the movie' });
      }
    });
});

router.delete('/:id', function (req, res) {
  appDataSource
    .getRepository(Movie)
    .delete({ id: req.params.id })
    .then(function () {
      res.status(204).json({ message: 'Movie successfully deleted' });
    })
    .catch(function () {
      res.status(500).json({ message: 'Error while deleting the movie' });
    });
});

export default router;
