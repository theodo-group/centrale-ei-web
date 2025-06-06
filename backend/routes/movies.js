import express from 'express';
import { appDataSource } from '../datasource.js';
import Movie from '../entities/movie.js';

const router = express.Router();

// Route GET principale avec pagination et tri
router.get('/', function (req, res) {
  try {
    // Paramètres de pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    // Paramètres de tri
    const sortBy = req.query.sortBy || 'title'; // title, popularity, vote_average, release_date
    const sortOrder = req.query.sortOrder || 'ASC'; // ASC ou DESC

    // Paramètres de recherche/filtrage
    const search = req.query.search; // Recherche dans le titre
    const minRating = parseFloat(req.query.minRating); // Note minimale
    const maxRating = parseFloat(req.query.maxRating); // Note maximale
    const year = parseInt(req.query.year); // Année de sortie

    // Validation des paramètres de tri
    const allowedSortFields = [
      'title',
      'popularity',
      'vote_average',
      'release_date',
      'vote_count',
    ];
    const allowedSortOrders = ['ASC', 'DESC'];

    if (!allowedSortFields.includes(sortBy)) {
      return res.status(400).json({
        error: 'Invalid sortBy parameter',
        message: `sortBy must be one of: ${allowedSortFields.join(', ')}`,
        allowedValues: allowedSortFields,
      });
    }

    if (!allowedSortOrders.includes(sortOrder.toUpperCase())) {
      return res.status(400).json({
        error: 'Invalid sortOrder parameter',
        message: 'sortOrder must be ASC or DESC',
        allowedValues: allowedSortOrders,
      });
    }

    // Validation de la pagination
    if (page < 1 || limit < 1 || limit > 200) {
      return res.status(400).json({
        error: 'Invalid pagination parameters',
        message: 'page must be >= 1, limit must be between 1 and 200',
      });
    }

    const movieRepository = appDataSource.getRepository(Movie);
    const queryBuilder = movieRepository.createQueryBuilder('movie');

    // Filtres conditionnels
    if (search) {
      queryBuilder.andWhere(
        '(movie.title LIKE :search OR movie.original_title LIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (!isNaN(minRating)) {
      queryBuilder.andWhere('movie.vote_average >= :minRating', { minRating });
    }

    if (!isNaN(maxRating)) {
      queryBuilder.andWhere('movie.vote_average <= :maxRating', { maxRating });
    }

    if (!isNaN(year)) {
      queryBuilder.andWhere('movie.release_date LIKE :year', {
        year: `${year}%`,
      });
    }

    // Tri
    queryBuilder.orderBy(`movie.${sortBy}`, sortOrder.toUpperCase());

    // Pagination
    queryBuilder.skip(offset).take(limit);

    // Exécution de la requête avec count pour la pagination
    Promise.all([queryBuilder.getMany(), queryBuilder.getCount()])
      .then(([movies, totalCount]) => {
        const totalPages = Math.ceil(totalCount / limit);

        res.json({
          movies: movies,
          pagination: {
            currentPage: page,
            totalPages: totalPages,
            totalItems: totalCount,
            itemsPerPage: limit,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
          },
          sorting: {
            sortBy: sortBy,
            sortOrder: sortOrder,
          },
          filters: {
            search: search || null,
            minRating: !isNaN(minRating) ? minRating : null,
            maxRating: !isNaN(maxRating) ? maxRating : null,
            year: !isNaN(year) ? year : null,
          },
        });
      })
      .catch(function (error) {
        console.error('Error fetching movies:', error);
        res.status(500).json({
          error: 'Database error',
          details: error.message,
        });
      });
  } catch (error) {
    console.error('Error in movies route:', error);
    res.status(500).json({
      error: 'Server error',
      details: error.message,
    });
  }
});

// Route pour obtenir les films les mieux notés
router.get('/top-rated', function (req, res) {
  const limit = parseInt(req.query.limit) || 50;

  if (limit > 200) {
    return res.status(400).json({
      error: 'Limit too high',
      message: 'Maximum limit is 200',
    });
  }

  appDataSource
    .getRepository(Movie)
    .find({
      order: {
        vote_average: 'DESC',
        vote_count: 'DESC', // Tri secondaire par nombre de votes
      },
      take: limit,
      where: {
        vote_average: appDataSource
          .getRepository(Movie)
          .createQueryBuilder()
          .where('vote_average IS NOT NULL')
          .andWhere('vote_average > 0'),
      },
    })
    .then(function (movies) {
      res.json({
        movies: movies,
        count: movies.length,
        type: 'top-rated',
      });
    })
    .catch(function (error) {
      console.error('Error fetching top-rated movies:', error);
      res.status(500).json({
        error: 'Database error',
        details: error.message,
      });
    });
});

// Route pour obtenir les films les plus populaires
router.get('/popular', function (req, res) {
  const limit = parseInt(req.query.limit) || 50;

  if (limit > 200) {
    return res.status(400).json({
      error: 'Limit too high',
      message: 'Maximum limit is 200',
    });
  }

  appDataSource
    .getRepository(Movie)
    .find({
      order: {
        popularity: 'DESC',
      },
      take: limit,
      where: {
        popularity: appDataSource
          .getRepository(Movie)
          .createQueryBuilder()
          .where('popularity IS NOT NULL')
          .andWhere('popularity > 0'),
      },
    })
    .then(function (movies) {
      res.json({
        movies: movies,
        count: movies.length,
        type: 'popular',
      });
    })
    .catch(function (error) {
      console.error('Error fetching popular movies:', error);
      res.status(500).json({
        error: 'Database error',
        details: error.message,
      });
    });
});

// Route pour obtenir les films récents
router.get('/recent', function (req, res) {
  const limit = parseInt(req.query.limit) || 50;

  if (limit > 200) {
    return res.status(400).json({
      error: 'Limit too high',
      message: 'Maximum limit is 200',
    });
  }

  appDataSource
    .getRepository(Movie)
    .find({
      order: {
        release_date: 'DESC',
      },
      take: limit,
      where: {
        release_date: appDataSource
          .getRepository(Movie)
          .createQueryBuilder()
          .where('release_date IS NOT NULL'),
      },
    })
    .then(function (movies) {
      res.json({
        movies: movies,
        count: movies.length,
        type: 'recent',
      });
    })
    .catch(function (error) {
      console.error('Error fetching recent movies:', error);
      res.status(500).json({
        error: 'Database error',
        details: error.message,
      });
    });
});

// Récupérer tous les films likés/dislikés
router.get('/ratings/all', async function (req, res) {
  try {
    const movieRepository = appDataSource.getRepository(Movie);

    // Récupérer tous les films avec un rating non-neutre
    const ratedMovies = await movieRepository.find({
      where: [
        { likedislike: 1 }, // Films likés
        { likedislike: -1 }, // Films dislikés
      ],
      select: [
        'id',
        'title',
        'likedislike',
        'poster_path',
        'vote_average',
        'release_date',
      ],
    });

    // Organiser par catégorie
    const liked = ratedMovies.filter((movie) => movie.likedislike === 1);
    const disliked = ratedMovies.filter((movie) => movie.likedislike === -1);

    res.json({
      success: true,
      data: {
        liked: liked,
        disliked: disliked,
        total: {
          liked: liked.length,
          disliked: disliked.length,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching all ratings:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch movie ratings',
    });
  }
});

// Route pour rechercher des films
router.get('/search', function (req, res) {
  const query = req.query.q;
  const limit = parseInt(req.query.limit) || 20;
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * limit;

  if (!query) {
    return res.status(400).json({
      error: 'Missing search query',
      message: 'Please provide a search query using ?q=your_search_term',
    });
  }

  if (limit > 200) {
    return res.status(400).json({
      error: 'Limit too high',
      message: 'Maximum limit is 200',
    });
  }

  const movieRepository = appDataSource.getRepository(Movie);
  const queryBuilder = movieRepository.createQueryBuilder('movie');

  queryBuilder
    .where('movie.title LIKE :query', { query: `%${query}%` })
    .orWhere('movie.original_title LIKE :query', { query: `%${query}%` })
    .orWhere('movie.overview LIKE :query', { query: `%${query}%` })
    .orderBy('movie.popularity', 'DESC')
    .skip(offset)
    .take(limit);

  Promise.all([queryBuilder.getMany(), queryBuilder.getCount()])
    .then(([movies, totalCount]) => {
      const totalPages = Math.ceil(totalCount / limit);

      res.json({
        movies: movies,
        searchQuery: query,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalItems: totalCount,
          itemsPerPage: limit,
        },
      });
    })
    .catch(function (error) {
      console.error('Error searching movies:', error);
      res.status(500).json({
        error: 'Database error',
        details: error.message,
      });
    });
});

// Route GET pour un film spécifique
router.get('/:id', function (req, res) {
  const movieId = parseInt(req.params.id);
  if (isNaN(movieId) || movieId <= 0) {
    return res.status(400).json({
      error: 'Invalid ID format',
      message: 'ID must be a positive number',
    });
  }
  const movieRepository = appDataSource.getRepository(Movie);
  movieRepository
    .findOneBy({ id: movieId })
    .then(function (movie) {
      if (!movie) {
        return res.status(404).json({
          error: 'Movie not found',
          message: `No movie found with ID ${movieId}`,
        });
      }
      res.status(200).json({
        message: 'Movie retrieved successfully',
        movie: movie,
      });
    })
    .catch(function (error) {
      console.error('Error fetching movie:', error);
      res.status(500).json({
        error: 'Database error',
        details: error.message,
      });
    });
});

//Récupérer le statut like/dislike d'un film
router.get('/:id/rating', async function (req, res) {
  try {
    const movieId = parseInt(req.params.id);

    if (isNaN(movieId) || movieId <= 0) {
      return res.status(400).json({
        error: 'Invalid ID format',
        message: 'ID must be a positive number',
      });
    }

    const movieRepository = appDataSource.getRepository(Movie);

    const movie = await movieRepository.findOne({
      where: { id: movieId },
      select: ['id', 'title', 'likedislike'],
    });

    if (!movie) {
      return res.status(404).json({
        error: 'Movie not found',
        message: `No movie found with id ${movieId}`,
      });
    }

    res.json({
      success: true,
      data: {
        id: movie.id,
        title: movie.title,
        likedislike: movie.likedislike || 0,
      },
    });
  } catch (error) {
    console.error('Error fetching movie rating:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch movie rating',
    });
  }
});

// Mettre à jour le like/dislike d'un film
router.patch('/:id/rating', async function (req, res) {
  try {
    const movieId = parseInt(req.params.id);
    const { likedislike } = req.body;

    // Validation de l'ID
    if (isNaN(movieId) || movieId <= 0) {
      return res.status(400).json({
        error: 'Invalid ID format',
        message: 'ID must be a positive number',
      });
    }

    // Validation de l'input
    if (likedislike === undefined || likedislike === null) {
      return res.status(400).json({
        error: 'likedislike value is required',
        message: 'Please provide a likedislike value (-1, 0, or 1)',
      });
    }

    // Validation des valeurs autorisées
    const validValues = [-1, 0, 1];
    if (!validValues.includes(likedislike)) {
      return res.status(400).json({
        error: 'Invalid likedislike value',
        message: 'likedislike must be -1 (dislike), 0 (neutral), or 1 (like)',
      });
    }

    // Récupérer le repository des films
    const movieRepository = appDataSource.getRepository(Movie);

    // Vérifier que le film existe
    const movie = await movieRepository.findOne({
      where: { id: movieId },
    });

    if (!movie) {
      return res.status(404).json({
        error: 'Movie not found',
        message: `No movie found with id ${movieId}`,
      });
    }

    // Mettre à jour le likedislike
    await movieRepository.update({ id: movieId }, { likedislike: likedislike });

    // Récupérer le film mis à jour
    const updatedMovie = await movieRepository.findOne({
      where: { id: movieId },
    });

    console.log(`Movie ${movieId} rating updated to: ${likedislike}`);

    res.json({
      success: true,
      message: 'Movie rating updated successfully',
      data: {
        id: updatedMovie.id,
        title: updatedMovie.title,
        likedislike: updatedMovie.likedislike,
      },
    });
  } catch (error) {
    console.error('Error updating movie rating:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update movie rating',
    });
  }
});

// Route POST pour créer un nouveau film
router.post('/new', function (req, res) {
  const movieRepository = appDataSource.getRepository(Movie);
  const newMovie = movieRepository.create({
    title: req.body.title,
    release_date: req.body.release_date,
  });

  movieRepository
    .save(newMovie)
    .then(function (savedMovie) {
      res.status(201).json({
        message: 'Movie successfully created',
        id: savedMovie.id,
      });
    })
    .catch(function (error) {
      console.error(error);
      if (error.code === '23505') {
        res.status(400).json({
          message: `Movie with title "${newMovie.title}" already exists`,
        });
      } else {
        res.status(500).json({ message: 'Error while creating the movie' });
      }
    });
});

// Route DELETE pour supprimer un film
router.delete('/:id', function (req, res) {
  appDataSource
    .getRepository(Movie)
    .delete({ id: req.params.id })
    .then(function () {
      res.status(204).json({ message: 'Movie successfully deleted' });
    })
    .catch(function () {
      res.status(500).json({ message: 'Error while deleting the movie' });
    });
});

export default router;
