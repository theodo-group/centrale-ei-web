import express from 'express';
import { appDataSource } from '../datasource.js';
import Score from '../entities/score.js';
import Movie from '../entities/movie.js';
import User from '../entities/user.js';

const router = express.Router();

router.post('/new', async function (req, res) {
  console.log(req.body);
  const movie = await appDataSource
    .getRepository(Movie)
    .findOne({ where: { id: req.body.movie_id } });
  const user = await appDataSource
    .getRepository(User)
    .findOne({ where: { id: req.body.user_id } });
  console.log(movie, user);
  const scoreRepository = appDataSource.getRepository(Score);
  const newScore = scoreRepository.create({
    movies: movie,
    users: user,
    score: req.body.score,
  });

  scoreRepository.save(newScore).then(function (savedScore) {
    res.status(201).json({
      message: 'Score successfully created',
      id: savedScore.id,
    });
  });
  // .catch(function (error) {
  //   console.error('error', error);
  //   if (error.code === 'SQLITE_CONSTRAINT') {
  //     res.status(400).json({
  //       message: `User with email '${newUser.email}' already exists`,
  //     });
  //   } else {
  //     res.status(500).json({ message: 'Error while creating the user' });
  //   }
  // });
});

// router.delete('/:userId', function (req, res) {
//   appDataSource
//     .getRepository(User)
//     .delete({ id: req.params.userId })
//     .then(function () {
//       res.status(204).json({ message: 'User successfully deleted' });
//     })
//     .catch(function () {
//       res.status(500).json({ message: 'Error while deleting the user' });
//     });
// });

export default router;
