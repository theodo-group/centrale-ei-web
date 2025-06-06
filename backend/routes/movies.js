const express = require('express');
const axios = require('axios');
const { appDataSource } = require('../datasource.js');
const { Movie } = require('../entities/movies.js');
const { Genre } = require('../entities/genres.js');

const router = express.Router();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_API_URL = 'https://api.themoviedb.org/3/movie';

// Liste tous les films
router.get('/', async function (req, res) {
  try {
    const movieRepository = appDataSource.getRepository(Movie);
    const movies = await movieRepository.find();
    res.json(movies);
  } catch (error) {
    console.error('Error while retrieving movies:', error);
    res.status(500).json({ message: 'Server error while retrieving films' });
  }
});

// Crée un nouveau film minimal (sans TMDB)
router.post('/new', async function (req, res) {
  const movieRepository = appDataSource.getRepository(Movie);
  const newMovie = movieRepository.create({
    title: req.body.title,
    releaseDate: req.body.releaseDate,
  });

  try {
    const savedMovie = await movieRepository.save(newMovie);
    res.status(201).json({
      message: 'Movie successfully created',
      id: savedMovie.id,
    });
  } catch (error) {
    console.error(error);
    if (error.code === '23505') {
      res.status(400).json({
        message: `Movie with id "${newMovie.id}" already exists`,
      });
    } else {
      res.status(500).json({ message: 'Error while creating the movie' });
    }
  }
});

// Récupère un film (et ses genres) depuis DB ou TMDB
router.get('/:id', async function (req, res) {
  const movieId = parseInt(req.params.id, 10);
  if (isNaN(movieId)) {
    return res.status(400).json({ message: 'Invalid movie ID' });
  }

  const movieRepository = appDataSource.getRepository(Movie);
  const genreRepository = appDataSource.getRepository(Genre);

  try {
    let movie = await movieRepository.findOne({
      where: { id: movieId },
      relations: ['genres'],
    });

    if (movie) {
      console.log(`Movie ${movieId} found in DB.`);
      return res.status(200).json(movie);
    }

    console.log(`Movie ${movieId} not found in DB, fetching from TMDB...`);

    if (!TMDB_API_KEY) {
      console.error('TMDB_API_KEY is not set');
      return res.status(500).json({ message: 'TMDB API key is not configured' });
    }

    const response = await axios.get(`${TMDB_API_URL}/${movieId}`, {
      headers: { Authorization: `Bearer ${TMDB_API_KEY}` },
      params: { language: 'fr-FR' },
    });

    const movieData = response.data;
    console.log(`Movie ${movieId} fetched from TMDB: ${movieData.title}`);

    // Gestion des genres
    const genres = await Promise.all(
      (movieData.genres || []).map(async (g) => {
        let genre = await genreRepository.findOne({ where: { id: g.id } });
        if (!genre) {
          genre = genreRepository.create({ id: g.id, name: g.name });
          await genreRepository.save(genre);
          console.log(`Genre ${g.name} created in DB.`);
        }
        return genre;
      })
    );

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
      genres,
    });

    await movieRepository.save(movie);
    console.log(`Movie ${movieId} saved in DB.`);

    res.status(200).json(movie);
  } catch (error) {
    if (error.response) {
      console.error(`TMDB API error (status ${error.response.status}):`, error.response.data);
      if (error.response.status === 404) {
        return res.status(404).json({ message: `Movie with id ${movieId} not found on TMDB.` });
      }
    } else {
      console.error('Error fetching movie by id:', error.message);
    }
    res.status(500).json({ message: 'Server error while fetching movie' });
  }
});

// Supprime un film
router.delete('/:id', async function (req, res) {
  const movieId = parseInt(req.params.id, 10);
  if (isNaN(movieId)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }

  const movieRepository = appDataSource.getRepository(Movie);

  try {
    const movie = await movieRepository.findOne({ where: { id: movieId } });
    if (!movie) {
      return res
        .status(404)
        .json({ message: `No movies found with id ${movieId}` });
    }

    await movieRepository.remove(movie);
    res.status(200).json({ message: `Movie with id ${movieId} deleted` });
  } catch (error) {
    console.error('Error while deleting movie:', error);
    res.status(500).json({ message: 'Server error during deletion' });
  }
});

// Films similaires (via TMDB uniquement)
router.get('/:id/similar', async (req, res) => {
  const movieId = req.params.id;

  try {
    const response = await axios.get(`${TMDB_API_URL}/${movieId}/similar`, {
      headers: { Authorization: `Bearer ${TMDB_API_KEY}` },
      params: { language: 'fr-FR' },
    });
    res.json(response.data);
  } catch (error) {
    console.error('❌ Erreur TMDB :', error.response?.data || error.message);
    res
      .status(500)
      .json({ error: 'Erreur lors de la récupération des films similaires' });
  }
});

module.exports = router;
