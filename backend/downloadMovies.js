import axios from 'axios';
import { appDataSource } from './datasource.js';
import Movie from './entities/movie.js';

// Configuration
const CONFIG = {
  MAX_PAGES: 50, // Nombre de pages à télécharger (50 = 1000 films)
  DELAY_MS: 150, // Pause entre requêtes (150ms)
  BATCH_SIZE: 20, // Nombre de films à sauvegarder en une fois
  SORT_OPTION: 'default', // Type de tri ('default', 'vote_average', 'release_date', etc.)
};

// Configuration API TheMovieDB
const API_CONFIG = {
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo',
  },
};

// Fonction pour obtenir les paramètres d'API selon le tri
function getApiParams(sortOption) {
  const today = new Date().toISOString().split('T')[0];

  const commonParams = {
    language: 'en-US',
    'release_date.lte': today,
    with_release_type: '2|3',
  };

  switch (sortOption) {
    case 'vote_average':
      return {
        url: 'https://api.themoviedb.org/3/discover/movie',
        params: {
          sort_by: 'vote_average.desc',
          'vote_count.gte': 100,
          ...commonParams,
        },
      };
    case 'release_date':
      return {
        url: 'https://api.themoviedb.org/3/discover/movie',
        params: {
          sort_by: 'release_date.desc',
          ...commonParams,
        },
      };
    case 'popularity':
      return {
        url: 'https://api.themoviedb.org/3/discover/movie',
        params: {
          sort_by: 'popularity.desc',
          ...commonParams,
        },
      };
    default:
      return {
        url: 'https://api.themoviedb.org/3/trending/movie/day',
        params: { language: 'en-US' },
      };
  }
}

// Fonction pour transformer les données API vers format base
function transformMovieData(apiMovie) {
  return {
    title: apiMovie.title || 'Unknown Title',
    release_date: apiMovie.release_date || null,
    poster_path: apiMovie.poster_path || null,
    overview: apiMovie.overview || null,
    popularity: apiMovie.popularity || null,
    vote_average: apiMovie.vote_average || null,
    vote_count: apiMovie.vote_count || null,
    media_type: apiMovie.media_type || 'movie',
    tmdb_id: apiMovie.id || null,
    original_language: apiMovie.original_language || null,
    backdrop_path: apiMovie.backdrop_path || null,
    adult: apiMovie.adult || false,
  };
}

// Fonction pour sauvegarder un batch de films
async function saveMovieBatch(movies, movieRepository) {
  const transformedMovies = movies.map(transformMovieData);
  const savedMovies = [];

  for (const movieData of transformedMovies) {
    try {
      // Vérifier si le film existe déjà (par tmdb_id ou title)
      const existingMovie = await movieRepository.findOne({
        where: [{ tmdb_id: movieData.tmdb_id }, { title: movieData.title }],
      });

      if (existingMovie) {
        console.log(`Film déjà existant: ${movieData.title}`);
        continue;
      }

      // Créer et sauvegarder le nouveau film
      const newMovie = movieRepository.create(movieData);
      const savedMovie = await movieRepository.save(newMovie);
      savedMovies.push(savedMovie);

      console.log(`Sauvegardé: ${movieData.title} (ID: ${savedMovie.id})`);
    } catch (error) {
      console.error(`Erreur sauvegarde ${movieData.title}:`, error.message);
    }
  }

  return savedMovies;
}

// Fonction principale pour télécharger tous les films
async function downloadMoviesToDatabase() {
  console.log('DEMARRAGE DU TELECHARGEMENT DE FILMS');
  console.log('=====================================');
  console.log(`Pages à télécharger: ${CONFIG.MAX_PAGES}`);
  console.log(`Films estimés: ${CONFIG.MAX_PAGES * 20}`);
  console.log(`Temps estimé: ${Math.round(CONFIG.MAX_PAGES * 0.2)} secondes`);
  console.log(`Tri: ${CONFIG.SORT_OPTION}`);
  console.log('');

  try {
    // Initialiser la connexion à la base de données
    if (!appDataSource.isInitialized) {
      await appDataSource.initialize();
      console.log('Connexion base de données établie');
    }

    const movieRepository = appDataSource.getRepository(Movie);

    // Compter les films existants
    const existingCount = await movieRepository.count();
    console.log(`Films déjà en base: ${existingCount}`);
    console.log('');

    // Obtenir les paramètres API
    const { url, params } = getApiParams(CONFIG.SORT_OPTION);

    let totalDownloaded = 0;
    let totalSaved = 0;
    const startTime = Date.now();

    // Boucle pour chaque page
    for (let page = 1; page <= CONFIG.MAX_PAGES; page++) {
      try {
        console.log(`Téléchargement page ${page}/${CONFIG.MAX_PAGES}...`);

        // Requête API
        const response = await axios.get(url, {
          ...API_CONFIG,
          params: { ...params, page },
        });

        const movies = response.data.results || [];
        totalDownloaded += movies.length;

        console.log(`Reçu ${movies.length} films de l'API`);

        // Sauvegarder les films par batch
        if (movies.length > 0) {
          const savedMovies = await saveMovieBatch(movies, movieRepository);
          totalSaved += savedMovies.length;

          console.log(
            `Sauvegardé ${savedMovies.length}/${movies.length} nouveaux films`
          );
        }

        // Statistiques de progression
        const elapsed = (Date.now() - startTime) / 1000;
        /* const remaining = CONFIG.MAX_PAGES - page; */
        const estimatedTotal = (elapsed * CONFIG.MAX_PAGES) / page;
        const eta = estimatedTotal - elapsed;

        console.log(
          `Progression: ${page}/${CONFIG.MAX_PAGES} pages (${Math.round(
            (page / CONFIG.MAX_PAGES) * 100
          )}%)`
        );
        console.log(
          `Temps écoulé: ${Math.round(elapsed)}s | ETA: ${Math.round(eta)}s`
        );
        console.log(
          `Total téléchargé: ${totalDownloaded} | Total sauvegardé: ${totalSaved}`
        );
        console.log('─'.repeat(50));

        // Pause pour ne pas surcharger l'API
        if (page < CONFIG.MAX_PAGES) {
          await new Promise((resolve) => setTimeout(resolve, CONFIG.DELAY_MS));
        }
      } catch (error) {
        console.error(`Erreur page ${page}:`, error.message);

        // Pause plus longue en cas d'erreur
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    // Statistiques finales
    const finalTime = (Date.now() - startTime) / 1000;
    const finalCount = await movieRepository.count();

    console.log('');
    console.log('TELECHARGEMENT TERMINE !');
    console.log('========================');
    console.log(`Temps total: ${Math.round(finalTime)} secondes`);
    console.log(`Films téléchargés: ${totalDownloaded}`);
    console.log(`Films sauvegardés: ${totalSaved}`);
    console.log(`Total en base: ${finalCount} films`);
    console.log(`Nouveaux films ajoutés: ${finalCount - existingCount}`);
  } catch (error) {
    console.error('ERREUR GENERALE:', error);
  } finally {
    // Fermer la connexion
    if (appDataSource.isInitialized) {
      await appDataSource.destroy();
      console.log('Connexion base fermée');
    }
  }
}

// Fonction utilitaire pour différents types de téléchargement
export const downloadPresets = {
  // Téléchargement rapide (pour tests)
  quick: () => {
    CONFIG.MAX_PAGES = 5;
    CONFIG.SORT_OPTION = 'default';

    return downloadMoviesToDatabase();
  },

  // Meilleurs films (par note)
  topRated: () => {
    CONFIG.MAX_PAGES = 50;
    CONFIG.SORT_OPTION = 'vote_average';

    return downloadMoviesToDatabase();
  },

  // Films récents
  recent: () => {
    CONFIG.MAX_PAGES = 30;
    CONFIG.SORT_OPTION = 'release_date';

    return downloadMoviesToDatabase();
  },

  // Films populaires
  popular: () => {
    CONFIG.MAX_PAGES = 100;
    CONFIG.SORT_OPTION = 'popularity';

    return downloadMoviesToDatabase();
  },

  // Collection complète
  full: () => {
    CONFIG.MAX_PAGES = 200;
    CONFIG.SORT_OPTION = 'default';

    return downloadMoviesToDatabase();
  },
};

// Exécution par défaut si script lancé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('Lancement du téléchargement de films...');
  downloadMoviesToDatabase()
    .then(() => {
      console.log('Script terminé avec succès !');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Script terminé avec erreur:', error);
      process.exit(1);
    });
}

export default downloadMoviesToDatabase;
