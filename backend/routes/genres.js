import express from 'express';
import { appDataSource } from '../datasource.js';
import Genre from '../entities/genre.js';

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
    .getRepository(Genre)
    .find({})
    .then(function (genres) {
      res.json({ genres });
    });
});

router.get('/:id', function (req, res) {
  appDataSource
    .getRepository(Genre)
    .find({
      where: {
        id: req.params.id,
      },
    })
    .then(function (genre) {
      if (genre.length === 0) {
        res.status(404).json({
          message: `Genre with id '${req.params.id}' does not exist`,
        });
      } else {
        res.status(200).json({ genre });
      }
    })
    .catch(function () {
      res.status(500).json({
        message: `An error occured`,
      });
    });
});
