import express from 'express';
import { appDataSource } from '../datasource.js';
import Movie from '../entities/movies.js';
const router = express.Router();

router.get('/', function (req, res) {
    appDataSource
      .getRepository(Movie)
      .find({})
      .then(function (movies) {
        res.json({ movies: movies });
      });
  });

router.get('/id', function (req, res) {
    appDataSource
    .getRepository(Movie)
    .find({
        where: {
        id: req.body.id
        },
    })
    .then(function (movies) {
        if (movies == {}){
            console.error(error);
            res.status(404).json({
            message: `Not found`,
          });
        }
        res.status(201).json({
          message: 'Movie successfully found',
          id: movie.id,
          name : movie.name
        });
      })
      .catch(function (error) {
        console.error(error);
          res.status(404).json({
            message: `Not found`,
          });
      });
});

router.post('/new', function (req, res) {
    const movieRepository = appDataSource.getRepository(Movie);
    const newMovie = movieRepository.create({
      name: req.body.name,
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
          message: `Movie "${newMovie.name}" already exists`,
        });
      } else {
        res.status(500).json({ message: 'Error while creating the movie' });
      }
    });
});

router.delete('/id', function (req, res) {
    appDataSource
      .getRepository(Movie)
      .delete({ id: req.body.id })
      .then(function (result) {
        if(result.affected == 0) {
            res.status(404).json({ message: 'Movie not found' });
        } else {
            appDataSource.getRepository(Movie).delete({ id: req.body.id });
            res.status(200).json({ message: 'Movie successfully deleted' });
        }
      })
      .catch(function () {
        res.status(404).json({ message: 'Error while deleting the user' });
      });
  });
export default router;