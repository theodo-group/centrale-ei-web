import express from 'express';
const router = express.Router();
import Movie from '../entities/movies.js';
import { appDataSource } from '../datasource.js';

router.get('/', function (req, res) {
  appDataSource
    .getRepository(Movie)
    .find({})
    .then(function (movies) {
      res.json({ movies: movies });
    });
});

router.post('/new', function (req, res) {
  const movieRepository = appDataSource.getRepository(Movie);
  const newMovie = movieRepository.create({
    releaseDate: req.body.releaseDate,
    title: req.body.title,
  });

  movieRepository
    .insert(newMovie)
    .then(function (newDocument) {
      res.status(201).json(newDocument);
    })
    .catch(function (error) {
      console.error(error);
      if (error.code === '23505') {
        res.status(400).json({
          message: `Movie with name "${newMovie.title}" already exists`,
        });
      } else {
        res.status(500).json({ message: 'Error while creating the movie' });
      }
    });
});

router.delete('/:movieId', function (req, res) {
appDataSource
.getRepository(Movie)
.delete({ id: req.params.movieId })
.then(function () {
  res.status(204).json({ message: 'Movie successfully deleted' });
})
.catch(function () {
  res.status(500).json({ message: 'Error while deleting the movie' });
});
});

export default router;
