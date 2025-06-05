import express from 'express';
import { appDataSource } from '../datasource.js';
import Ratings from '../entities/ratings.js';
import Movie from '../entities/movie.js';

const router = express.Router();


router.get('/', async (req, res) => {
  const { user_id, type } = req.query;
  if (!user_id) return res.status(400).json({ error: 'user_id requis' });

  const ratingsRepo = appDataSource.getRepository(Ratings);
  const moviesRepo = appDataSource.getRepository(Movie);

  // 1. Les films déjà notés par l'utilisateur courant
  const userRatings = await ratingsRepo.find({ where: { user_id: Number(user_id) } });
  const userMovieIds = userRatings.map(r => r.movie_id);

  if (userMovieIds.length === 0) return res.json([]);

  // 2. Les autres utilisateurs ayant noté les mêmes films
  const similarRatings = await ratingsRepo
    .createQueryBuilder('r')
    .where('r.movie_id IN (:...userMovieIds)', { userMovieIds })
    .andWhere('r.user_id != :user_id', { user_id })
    .getMany();

  // 3. Calcul de similarité simple
  const similarity = {};
  similarRatings.forEach(r => {
    if (!similarity[r.user_id]) similarity[r.user_id] = 0;
    const userNote = userRatings.find(ur => ur.movie_id === r.movie_id)?.rating;
    if (userNote && Math.abs(userNote - r.rating) <= 1) similarity[r.user_id]++;
  });

  // 4. Prendre les utilisateurs les plus proches (top 5)
  const similarUserIds = Object.entries(similarity)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([uid]) => Number(uid));

  if (similarUserIds.length === 0) return res.json([]);

  // 5. Les films bien notés par ces utilisateurs, que l'utilisateur courant n'a pas vus
  const recommendedRatings = await ratingsRepo
    .createQueryBuilder('r')
    .where('r.user_id IN (:...similarUserIds)', { similarUserIds })
    .andWhere('r.rating >= 4')
    .andWhere(userMovieIds.length > 0
      ? 'r.movie_id NOT IN (:...userMovieIds)'
      : '1=1', { userMovieIds: userMovieIds.length ? userMovieIds : [0] })
    .getMany();

  // 6. Récupérer les infos des films recommandés
  const movieIds = [...new Set(recommendedRatings.map(r => r.movie_id))];
  let movies = movieIds.length
    ? await moviesRepo.findByIds(movieIds)
    : [];

  if (type) {
    movies = movies.filter(m => m.type === type);
  }

  res.json(movies);
});
export default router;