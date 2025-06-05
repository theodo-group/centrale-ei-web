import express from 'express';
import { appDataSource } from '../datasource.js';
import Genre from '../entities/genre.js';

const router = express.Router();

// GET /genres - Récupérer tous les genres
router.get('/genres', async (req, res) => {
  try {
    const genreRepository = appDataSource.getRepository(Genre);
    const genres = await genreRepository.find({
      order: { tmdb_id: 'ASC' },
    });

    res.json({
      success: true,
      genres: genres,
      count: genres.length,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des genres:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des genres',
      error: error.message,
    });
  }
});

// GET /genres/:id - Récupérer un genre par son ID TMDB
router.get('/genres/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const genreRepository = appDataSource.getRepository(Genre);

    const genre = await genreRepository.findOne({
      where: { tmdb_id: parseInt(id) },
    });

    if (!genre) {
      return res.status(404).json({
        success: false,
        message: 'Genre non trouvé',
      });
    }

    res.json({
      success: true,
      genre: genre,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du genre:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du genre',
      error: error.message,
    });
  }
});

export default router;
