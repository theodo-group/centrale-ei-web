import express from 'express';
import { appDataSource } from '../datasource.js';
import Score from '../entities/score.js';
import Movie from '../entities/movie.js';
import User from '../entities/user.js';

const router = express.Router();

router.post('/new', async function (req, res) {
  try {
    const { movie_id, user_id, score } = req.body;

    // Rechercher le film et l'utilisateur
    const movie = await appDataSource
      .getRepository(Movie)
      .findOne({ where: { id: movie_id } });
    const user = await appDataSource
      .getRepository(User)
      .findOne({ where: { id: user_id } });

    if (!movie || !user) {
      return res.status(404).json({ message: 'Movie or User not found' });
    }

    const scoreRepository = appDataSource.getRepository(Score);

    // Supprimer tous les scores précédents pour le film et l'utilisateur donnés
    await scoreRepository.delete({
      movies: { id: movie.id },
      users: { id: user.id },
    });

    // Créer et sauvegarder le nouveau score
    const newScore = scoreRepository.create({
      movies: movie,
      users: user,
      score: score,
    });

    const savedScore = await scoreRepository.save(newScore);

    res.status(201).json({
      message: 'Score successfully created',
      id: savedScore.id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
