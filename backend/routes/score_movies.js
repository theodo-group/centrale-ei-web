import express from 'express';
import { appDataSource } from '../datasource.js';
import Movie from '../entities/movie.js';
import Score from '../entities/score.js';

const router = express.Router();

export default router;

router.get('/', async function (req, res) {
  try {
    const getScoresByGenre = async () => {
      return await appDataSource
        .getRepository(Score)
        .createQueryBuilder('score')
        .select('SUM(score.score)', 'totalScore')
        .addSelect('mgg.genreId', 'genreId')
        .innerJoin(Movie, 'movie', 'movie.id = score.moviesId')
        .innerJoin('movie_genres_genre', 'mgg', 'mgg.movieId = movie.id')
        .groupBy('mgg.genreId')
        .getRawMany();
    };

    const getTotalScoresByMovies = async (result) => {
      const genreScores = result.reduce((acc, row) => {
        acc[row.genreId] = row.totalScore;

        return acc;
      }, {});

      const genreIds = Object.keys(genreScores);

      // Créer une requête en utilisant les genres obtenus
      const query = appDataSource
        .getRepository(Movie)
        .createQueryBuilder('movie')
        .select('SUM(score.score)', 'totalMovieScore')
        .addSelect('mgg.movieId', 'movieId')
        .innerJoin('movie_genres_genre', 'mgg', 'mgg.movieId = movie.id')
        .innerJoin('score', 'score', 'score.moviesId = movie.id')
        .where('mgg.genreId IN (:...genreIds)', { genreIds })
        .groupBy('mgg.movieId');

      // Ajouter les scores de chaque genre à la requête
      genreIds.forEach((genreId) => {
        query.addSelect(
          `SUM(CASE WHEN mgg.genreId = ${genreId} THEN score.score ELSE 0 END)`,
          `genre_${genreId}_score`
        );
      });

      return await query.getRawMany();
    };

    const scoresByGenre = await getScoresByGenre();
    const scoreMovies = await getTotalScoresByMovies(scoresByGenre);

    res.json({ scoreMovies });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
