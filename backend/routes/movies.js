import express from 'express';
import axios from 'axios';
import { appDataSource } from '../datasource.js';
import Movie from '../entities/movies.js';

const router = express.Router();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_API_URL = 'https://api.themoviedb.org/3/movie/';

router.get('/', async function (req, res) {
  try {
    const movieRepository = appDataSource.getRepository(Movie);
    const movies = await movieRepository.find();
    res.json(movies);
  } catch (error) {
    console.error('Error while retrieving movies :', error);
    res.status(500).json({ message: 'Server error while retrieving films' });
  }
});

router.post('/new', function (req, res) {
  const movieRepository = appDataSource.getRepository(Movie);
  const newMovie = movieRepository.create({
    title: req.body.title,
    releaseDate: req.body.releaseDate,
  });

  movieRepository
    .save(newMovie)
    .then((savedMovie) => {
      res.status(201).json({
        message: 'Movie successfully created',
        id: savedMovie.id,
      });
    })
    .catch((error) => {
      console.error(error);
      if (error.code === '23505') {
        res.status(400).json({
          message: `Movie with id "${newMovie.id}" already exists`,
        });
      } else {
        res.status(500).json({ message: 'Error while creating the movie' });
      }
    });
});

// Récupérer un film par ID, si absent en base, le récupérer via TMDB puis sauvegarder
router.get('/:id', async function (req, res) {
  const movieId = parseInt(req.params.id, 10);
  if (isNaN(movieId)) {
    return res.status(400).json({ message: 'Invalid movie ID' });
  }

  const movieRepository = appDataSource.getRepository(Movie);

  try {
    let movie = await movieRepository.findOne({ where: { id: movieId } });
    if (movie) {
      return res.status(200).json(movie);
    }

    // Pas trouvé en base => requête TMDB
    const response = await axios.get(`${TMDB_API_URL}${movieId}`, {
      headers: { Authorization: `Bearer ${TMDB_API_KEY}` },
      params: { language: 'fr-FR' },
    });

    const movieData = response.data;

    movie = movieRepository.create({
      id: movieData.id,
      title: movieData.title,
      originalTitle: movieData.original_title,
      overview: movieData.overview,
      releaseDate: movieData.release_date,
      posterPath: movieData.poster_path,
      backdropPath: movieData.backdrop_path,
      voteAverage: movieData.vote_average,
      voteCount: movieData.vote_count,
      popularity: movieData.popularity,
      originalLanguage: movieData.original_language,
    });

    await movieRepository.save(movie);

    res.status(200).json(movie);
  } catch (error) {
    console.error(
      'Error fetching movie by id:',
      error.response?.data || error.message
    );
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', function (req, res) {
  const movieId = parseInt(req.params.id, 10);
  if (isNaN(movieId)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }

  const movieRepository = appDataSource.getRepository(Movie);

  movieRepository
    .find({ where: { id: movieId } })
    .then((movies) => {
      if (movies.length === 0) {
        return res
          .status(404)
          .json({ message: `No movies found with id ${movieId}` });
      }

      return movieRepository.remove(movies[0]).then(() => {
        res.status(200).json({ message: `Movie with id ${movieId} deleted` });
      });
    })
    .catch((error) => {
      console.error('Error while deleting film :', error);
      res.status(500).json({ message: 'Server error' });
    });
});

router.get('/:id/similar', async (req, res) => {
  const movieId = req.params.id;

  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}/similar`,
      {
        headers: { Authorization: `Bearer ${TMDB_API_KEY}` },
        params: { language: 'fr-FR' },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('❌ Erreur TMDB :', error.response?.data || error.message);
    res
      .status(500)
      .json({ error: 'Erreur lors de la récupération des films similaires' });
  }
});

export default router;
