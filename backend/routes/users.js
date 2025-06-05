import express from 'express';
import { appDataSource } from '../datasource.js';
import User from '../entities/user.js';
// import Movie from '../entities/users.js';

const router = express.Router();

// router.get('/',  function (req, res) {
//   appDataSource
//     .getRepository(User)
//     .find({})
//     .then(function (users) {
//       res.json({ users: users });
//     });
// });

router.get('/', async function (req, res) {
  try {
    const userRepository = appDataSource.getRepository(User);
    const users = await userRepository.find();
    res.json(users);
    console.log('users callback works');
  } catch (error) {
    console.error('Error while retrieving users :', error);
    res.status(500).json({ message: 'Server error while retrieving users' });
  }
});

router.post('/new', function (req, res) {
  const userRepository = appDataSource.getRepository(User);
  const newUser = userRepository.create({
    email: req.body.email,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
  });

  userRepository
    .save(newUser)
    .then(function (savedUser) {
      res.status(201).json({
        message: 'User successfully created',
        id: savedUser.id,
      });
    })
    .catch(function (error) {
      console.error(error);
      if (error.code === '23505') {
        res.status(400).json({
          message: `User with email "${newUser.email}" already exists`,
        });
      } else {
        res.status(500).json({ message: 'Error while creating the user' });
      }
    });
});

router.delete('/:userId', function (req, res) {
  appDataSource
    .getRepository(User)
    .delete({ id: req.params.userId })
    .then(function () {
      res.status(204).json({ message: 'User successfully deleted' });
    })
    .catch(function () {
      res.status(500).json({ message: 'Error while deleting the user' });
    });
});

router.get('/prenoms', function (req, res, next) {
  appDataSource
    .getRepository(User)
    .find({ select: ['firstname'] })
    .then(function (users) {
      console.log(users);
      res.json({ users });
    })
    .catch(next);
});

export default router;
