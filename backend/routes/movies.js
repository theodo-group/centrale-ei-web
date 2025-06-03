import express from 'express';
import { appDataSource } from '../datasource.js';
import Movie from '../entities/movies.js';

const router = express.Router();

router.get('/', async function (req, res) {
  try {
    const movieRepository = appDataSource.getRepository(Movie);
    const movies = await movieRepository.find();
    res.json(movies);
    console.log('movies callback works');
  } catch (error) {
    console.error('Error while retrieving movies :', error);
    res.status(500).json({ message: 'Server error while retrieving films' });
  }
});

router.post('/new', function (req, res) {
  console.log('movies/new callback works');
  const movieRepository = appDataSource.getRepository(Movie);
  const newMovie = movieRepository.create({
    title: req.body.title,
    releaseDate: req.body.releaseDate,
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
          message: `Movie with id "${newMovie.id}" already exists`,
        });
      } else {
        res.status(500).json({ message: 'Error while creating the movie' });
      }
    });
});

router.get('/:id', function (req, res) {
  const movieId = parseInt(req.params.id, 10);
  const movieRepository = appDataSource.getRepository(Movie);

  movieRepository
    .find({ where: { id: movieId } })
    .then((movies) => {
      if (movies.length > 0) {
        res.status(200).json(movies[0]);
      } else {
        res.status(404).json({ message: `No movies found with id ${movieId}` });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    });
});

router.delete('/:id', function (req, res) {
  const movieId = parseInt(req.params.id, 10);
  if (isNaN(movieId)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }

  const movieRepository = appDataSource.getRepository(Movie);

  movieRepository
    .find({ where: { id: movieId } })
    .then((movies) => {
      if (movies.length === 0) {
        return res
          .status(404)
          .json({ message: `No movies found with id ${movieId}` });
      }

      return movieRepository.remove(movies[0]).then(() => {
        res.status(200).json({ message: `Movie with id ${movieId} deleted` });
      });
    })
    .catch((error) => {
      console.error('Error while deleting film :', error);
      res.status(500).json({ message: 'Server error' });
    });
});

export default router;
