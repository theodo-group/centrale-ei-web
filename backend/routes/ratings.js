const express = require('express');
const { appDataSource } = require('../datasource.js');
const { Rating } = require('../entities/ratings.js');   // attention au nom fichier
const { User } = require('../entities/user.js');       // idem
const { Movie } = require('../entities/movies.js');

const router = express.Router();

router.post('/', async (req, res) => {
  const { userId, movieId, value } = req.body;

  if (!userId || !movieId || typeof value !== 'number') {
    return res.status(400).json({ message: 'Missing or invalid data' });
  }

  try {
    const userRepo = appDataSource.getRepository(User);
    const movieRepo = appDataSource.getRepository(Movie);
    const ratingRepo = appDataSource.getRepository(Rating);

    const user = await userRepo.findOneBy({ id: userId });
    const movie = await movieRepo.findOneBy({ id: movieId });

    if (!user || !movie) {
      return res.status(404).json({ message: 'User or movie not found' });
    }

    let rating = await ratingRepo.findOne({
      where: { user: { id: userId }, movie: { id: movieId } },
    });

    if (rating) {
      rating.value = value; // mise à jour
    } else {
      rating = ratingRepo.create({ user, movie, value });
    }

    await ratingRepo.save(rating);
    res.status(200).json({ message: 'Rating saved', rating });
  } catch (error) {
    console.error('Error saving rating:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const ratingRepo = appDataSource.getRepository(Rating);

    const ratings = await ratingRepo.find({
      where: { user: { id: userId } },
      relations: ['movie'],
    });

    const formatted = ratings.map((r) => ({
      id: r.movie.id,
      title: r.movie.title,
      poster_path: r.movie.posterPath,
      rating: r.value,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
