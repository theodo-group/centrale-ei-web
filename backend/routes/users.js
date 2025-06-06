const express = require('express');
const { appDataSource } = require('../datasource.js');
const { User } = require('../entities/user.js');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const userRepository = appDataSource.getRepository(User);
    const users = await userRepository.find();
    res.json(users);
  } catch (error) {
    console.error('Error while retrieving users:', error);
    res.status(500).json({ message: 'Server error while retrieving users' });
  }
});

router.post('/new', async (req, res) => {
  const userRepository = appDataSource.getRepository(User);
  const { email, firstname, lastname } = req.body;

  if (!email || !firstname || !lastname) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const newUser = userRepository.create({ email, firstname, lastname });
    const savedUser = await userRepository.save(newUser);
    res
      .status(201)
      .json({ message: 'User successfully created', id: savedUser.id });
  } catch (error) {
    console.error(error);
    if (error.code === '23505') {
      // Violation de contrainte unique (email déjà existant)
      return res
        .status(400)
        .json({ message: `User with email "${email}" already exists` });
    }
    res.status(500).json({ message: 'Error while creating the user' });
  }
});

router.delete('/:userId', async (req, res) => {
  try {
    const userRepository = appDataSource.getRepository(User);
    const deleteResult = await userRepository.delete({ id: req.params.userId });
    if (deleteResult.affected === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(204).end();
  } catch (error) {
    console.error('Error while deleting user:', error);
    res.status(500).json({ message: 'Error while deleting the user' });
  }
});

router.get('/prenoms', async (req, res, next) => {
  try {
    const userRepository = appDataSource.getRepository(User);
    const users = await userRepository.find({});
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const userRepository = appDataSource.getRepository(User);
    const userId = parseInt(req.params.userId, 10);

    const user = await userRepository.findOneBy({ id: userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
