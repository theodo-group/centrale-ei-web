import express from 'express';
import { appDataSource } from '../datasource.js';
import Movie from '../entities/movie.js';
import Score from '../entities/score.js';
const router = express.Router();

export default router;

router.get('/', function (req, res) {
  appDataSource
    .getRepository(Score)
    .createQueryBuilder('score')
    .select('SUM(score.score)', 'totalScore')
    .addSelect('mgg.genreId', 'genreId')
    .innerJoin(Movie, 'movie', 'movie.id = score.moviesId')
    .innerJoin('movie_genres_genre', 'mgg', 'mgg.movieId = movie.id')
    .groupBy('mgg.genreId')
    .getRawMany()
    .then(function (score_genres) {
      res.json({ score_genres });
    });
});
