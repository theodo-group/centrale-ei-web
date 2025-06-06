// routes/tmdbProxy.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_API_URL = 'https://api.themoviedb.org/3';

// Route pour récupérer les genres
router.get('/genre/movie/list', async (req, res) => {
  try {
    const response = await axios.get(`${TMDB_API_URL}/genre/movie/list`, {
      headers: {
        Authorization: `Bearer ${TMDB_API_KEY}`,
      },
      params: {
        language: 'fr-FR',
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Erreur lors de la récupération des genres:', error.message);
    res.status(500).json({ message: 'Erreur lors de la récupération des genres' });
  }
});

// Route pour découvrir des films avec pagination et filtres
router.get('/discover/movie', async (req, res) => {
  try {
    const params = {
      language: 'fr-FR',
      sort_by: req.query.sort_by || 'popularity.desc',
      include_adult: req.query.include_adult || false,
      page: req.query.page || 1,
      with_genres: req.query.with_genres || undefined,
    };

    // Nettoyer params pour ne pas envoyer undefined à axios
    Object.keys(params).forEach((key) => {
      if (params[key] === undefined) delete params[key];
    });

    const response = await axios.get(`${TMDB_API_URL}/discover/movie`, {
      headers: {
        Authorization: `Bearer ${TMDB_API_KEY}`,
      },
      params,
    });

    res.json(response.data);
  } catch (error) {
    console.error('Erreur lors de la récupération des films:', error.message);
    res.status(500).json({ message: 'Erreur lors de la récupération des films' });
  }
});

// Route pour la recherche de films
router.get('/search/movie', async (req, res) => {
  try {
    const params = {
      query: req.query.query,
      include_adult: req.query.include_adult || false,
      language: 'fr-FR',
      page: req.query.page || 1,
    };

    if (!params.query) {
      return res.status(400).json({ message: 'Paramètre query requis' });
    }

    const response = await axios.get(`${TMDB_API_URL}/search/movie`, {
      headers: {
        Authorization: `Bearer ${TMDB_API_KEY}`,
      },
      params,
    });

    res.json(response.data);
  } catch (error) {
    console.error('Erreur lors de la recherche de films:', error.message);
    res.status(500).json({ message: 'Erreur lors de la recherche de films' });
  }
});

module.exports = router;
