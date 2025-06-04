import express from 'express';
import Movie from '../entities/movie.js';
import { appDataSource } from '../datasource.js';

const router = express.Router();

router.get('/', async (req, res) => {
      const movieRepository = appDataSource.getRepository(Movie);
       movieRepository.find({})
      .then(function (movies) {
       res.status(200).json({ movies : movies });
  });
});

router.get('/:id', async (req, res) => {
      const movieRepository = appDataSource.getRepository(Movie);
      const movie = await movieRepository.find({ id: req.params.id });
  
      if (!movie) {
        return res.status(404).json({ message: 'Film non trouvé' });
      }
  
      res.status(200).json({ movie });
  });


  router.delete('/:id', async (req, res) => {
    const movieRepository = appDataSource.getRepository(Movie);
    const movie = await movieRepository.delete({ id: req.params.id });

    if (!movie) {
      return res.status(404).json({ message: 'Film non trouvé' });
    }

    res.status(200).json({ movie });
});



router.post('/new', async function (req, res) {
  const movieRepository = appDataSource.getRepository(Movie);
  const newMovie = movieRepository.create({
    id : req.body.id,
    title: req.body.title,
    year: req.body.year
  });

  try {
    const result = movieRepository.insert(newMovie);
    res.status(200).json({
      message: 'Movie successfully created',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error while creating the movie' });
  }
});

export default router;
