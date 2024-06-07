import express from 'express';
import { appDataSource } from '../datasource.js';
import Movie from '../entities/movie.js';

const router = express.Router();

export default router;
// const getAllMovies = async (req, res) => {
//   const movieRepository = appDataSource.getRepository(Movie);
//   const movies = await movieRepository.find();
//   res.json(movies);
// };
// router.get('/', getAllMovies);

router.get('/', function (req, res) {
  appDataSource
    .getRepository()
    .find({})
    .then(function (movies) {
      res.json({ movies });
    });
});

router.get('/:id', function (req, res) {
  appDataSource
    .getRepository(Movie)
    .find({
      where: {
        id: req.params.id,
      },
    })
    .then(function (movie) {
      if (movie.length === 0) {
        res.status(404).json({
          message: `Movie with id '${req.params.id}' does not exist`,
        });
      } else {
        res.status(200).json({ movie });
      }
    })
    .catch(function () {
      res.status(500).json({
        message: `An error occured`,
      });
    });
});
