import 'dotenv/config';
import axios from 'axios';
import { appDataSource } from './datasource.js';
import Genre from './entities/genre.js';

// Configuration API TheMovieDB
const API_CONFIG = {
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo',
  },
};

// Configuration pour la langue
const CONFIG = {
  LANGUAGE: 'en', // Langue par défaut pour les noms de genres
  DELAY_MS: 500, // Pause pour éviter le rate limiting
};

// Fonction pour transformer les données de genre depuis l'API
function transformGenreData(apiGenre) {
  return {
    tmdb_id: apiGenre.id,
    name: apiGenre.name,
  };
}

// Fonction pour vérifier si un genre a changé
function hasGenreDataChanged(existingGenre, newGenreData) {
  const fieldsToCompare = ['name'];

  for (const field of fieldsToCompare) {
    const existingValue = existingGenre[field];
    const newValue = newGenreData[field];

    if (newValue != null && String(existingValue) !== String(newValue)) {
      return true;
    }
  }

  return false;
}

// Fonction pour sauvegarder les genres
async function saveGenres(genres, genreRepository) {
  const savedGenres = [];
  const updatedGenres = [];
  const skippedGenres = [];

  for (const genreData of genres) {
    try {
      const transformedGenre = transformGenreData(genreData);

      // Vérifier si le genre existe déjà par tmdb_id
      let existingGenre = await genreRepository.findOne({
        where: { tmdb_id: transformedGenre.tmdb_id },
      });

      // Si pas trouvé par tmdb_id, chercher par nom (pour éviter les doublons de noms)
      if (!existingGenre) {
        existingGenre = await genreRepository.findOne({
          where: { name: transformedGenre.name },
        });
      }

      if (existingGenre) {
        // Vérifier si les données ont changé
        if (hasGenreDataChanged(existingGenre, transformedGenre)) {
          // Mettre à jour le genre existant - tmdb_id est la clé primaire
          const updateData = {};
          Object.keys(transformedGenre).forEach((key) => {
            if (transformedGenre[key] != null) {
              updateData[key] = transformedGenre[key];
            }
          });

          await genreRepository.update(existingGenre.tmdb_id, updateData); // Utilise tmdb_id (clé primaire)

          // Récupérer le genre mis à jour
          const updatedGenre = await genreRepository.findOne({
            where: { tmdb_id: existingGenre.tmdb_id }, // Utilise tmdb_id (clé primaire)
          });

          updatedGenres.push(updatedGenre);
          console.log(
            `Mis à jour: ${transformedGenre.name} (TMDB ID: ${existingGenre.tmdb_id})`
          );
        } else {
          skippedGenres.push(existingGenre);
          console.log(
            `Aucun changement: ${transformedGenre.name} (TMDB ID: ${existingGenre.tmdb_id})`
          );
        }
        continue;
      }

      // Créer un nouveau genre s'il n'existe pas
      const newGenre = genreRepository.create(transformedGenre);
      const savedGenre = await genreRepository.save(newGenre);
      savedGenres.push(savedGenre);

      console.log(
        `Nouveau genre: ${transformedGenre.name} (TMDB ID: ${savedGenre.tmdb_id})`
      );
    } catch (error) {
      console.error(`Erreur sauvegarde ${genreData.name}:`, error.message);
      console.error('Stack trace:', error.stack); // Ajout pour debug
    }
  }

  return {
    saved: savedGenres,
    updated: updatedGenres,
    skipped: skippedGenres,
    totalProcessed:
      savedGenres.length + updatedGenres.length + skippedGenres.length,
  };
}

// Fonction pour télécharger les genres depuis l'API
async function downloadGenresFromApi() {
  try {
    console.log(`Téléchargement des genres en ${CONFIG.LANGUAGE}...`);

    const response = await axios.get(
      'https://api.themoviedb.org/3/genre/movie/list',
      {
        ...API_CONFIG,
        params: { language: CONFIG.LANGUAGE },
      }
    );

    const genres = response.data.genres || [];
    console.log(`Reçu ${genres.length} genres depuis l'API`);

    return genres;
  } catch (error) {
    console.error(`Erreur lors du téléchargement des genres:`, error.message);
    console.error("Détails de l'erreur:", error.response?.data || error.stack);
    throw error;
  }
}

// Fonction principale pour télécharger tous les genres
async function downloadGenresToDatabase() {
  console.log('DÉMARRAGE DU TÉLÉCHARGEMENT DES GENRES');
  console.log('======================================');
  console.log(`Langue: ${CONFIG.LANGUAGE}`);
  console.log('');

  try {
    // Initialiser la connexion à la base de données
    if (!appDataSource.isInitialized) {
      await appDataSource.initialize();
      console.log('Connexion base de données établie');
      console.log('Base de données:', appDataSource.options.database);
    }

    const genreRepository = appDataSource.getRepository(Genre);

    // Compter les genres existants
    const existingCount = await genreRepository.count();
    console.log(`Genres déjà en base: ${existingCount}`);
    console.log('');

    const startTime = Date.now();

    // Télécharger les genres depuis l'API
    const genres = await downloadGenresFromApi();

    // Sauvegarder les genres
    let result = { saved: [], updated: [], skipped: [], totalProcessed: 0 };

    if (genres.length > 0) {
      result = await saveGenres(genres, genreRepository);

      console.log('');
      console.log('Résultats de la sauvegarde:');
      console.log(`- Nouveaux genres: ${result.saved.length}`);
      console.log(`- Genres mis à jour: ${result.updated.length}`);
      console.log(`- Genres inchangés: ${result.skipped.length}`);
      console.log(`- Total traité: ${result.totalProcessed}/${genres.length}`);
    }

    // Pause pour éviter le rate limiting
    console.log('');
    console.log('Pause de sécurité...');
    await new Promise((resolve) => setTimeout(resolve, CONFIG.DELAY_MS));

    // Statistiques finales
    const finalTime = (Date.now() - startTime) / 1000;
    const finalCount = await genreRepository.count();

    console.log('');
    console.log('TÉLÉCHARGEMENT DES GENRES TERMINÉ !');
    console.log('===================================');
    console.log(`Temps total: ${Math.round(finalTime)} secondes`);
    console.log(`Genres téléchargés: ${genres.length}`);
    console.log(`Nouveaux genres: ${result.saved.length}`);
    console.log(`Genres mis à jour: ${result.updated.length}`);
    console.log(`Genres inchangés: ${result.skipped.length}`);
    console.log(`Total en base: ${finalCount} genres`);
    console.log(`Nouveaux ajoutés: ${finalCount - existingCount}`);

    // Affichage de la liste des genres en base
    console.log('');
    console.log('Liste des genres en base de données:');
    console.log('------------------------------------');
    const allGenres = await genreRepository.find({
      order: { tmdb_id: 'ASC' },
    });

    allGenres.forEach((genre) => {
      console.log(`TMDB ID ${genre.tmdb_id}: ${genre.name}`);
    });
  } catch (error) {
    console.error('ERREUR GÉNÉRALE:', error);
    console.error('Stack trace:', error.stack);
  } finally {
    // Fermer la connexion
    if (appDataSource.isInitialized) {
      await appDataSource.destroy();
      console.log('');
      console.log('Connexion base fermée');
    }
  }
}

// Fonction utilitaire pour différents types de téléchargement
export const downloadGenrePresets = {
  // Téléchargement anglais (par défaut)
  english: () => {
    CONFIG.LANGUAGE = 'en';

    return downloadGenresToDatabase();
  },

  // Téléchargement français
  french: () => {
    CONFIG.LANGUAGE = 'fr';

    return downloadGenresToDatabase();
  },

  // Téléchargement espagnol
  spanish: () => {
    CONFIG.LANGUAGE = 'es';

    return downloadGenresToDatabase();
  },

  // Téléchargement allemand
  german: () => {
    CONFIG.LANGUAGE = 'de';

    return downloadGenresToDatabase();
  },

  // Téléchargement personnalisé
  custom: (language) => {
    CONFIG.LANGUAGE = language;

    return downloadGenresToDatabase();
  },
};

// Fonction de debug pour tester la détection du fichier principal
function isMainModule() {
  try {
    // Méthode plus robuste pour détecter si c'est le module principal
    const currentFileUrl = import.meta.url;
    const mainFileUrl = `file://${process.argv[1]}`;

    // Décoder les URLs pour comparer les vrais chemins
    const currentPath = decodeURIComponent(currentFileUrl);
    const mainPath = decodeURIComponent(mainFileUrl);

    console.log('=== DEBUG MODULE DETECTION ===');
    console.log('currentPath (decoded):', currentPath);
    console.log('mainPath (decoded):', mainPath);
    console.log('Match:', currentPath === mainPath);
    console.log('==============================');

    return currentPath === mainPath;
  } catch (error) {
    console.error('Erreur dans isMainModule:', error);

    // Fallback : toujours exécuter en cas d'erreur
    return true;
  }
}

// Exécution par défaut si script lancé directement
if (isMainModule()) {
  console.log('Lancement du téléchargement des genres...');

  // Par défaut, télécharge en anglais
  downloadGenresToDatabase()
    .then(() => {
      console.log('Script terminé avec succès !');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Script terminé avec erreur:', error);
      console.error('Stack:', error.stack);
      process.exit(1);
    });
} else {
  console.log("Script importé comme module, pas d'exécution automatique.");
  console.log(
    "Pour forcer l'exécution, appelez downloadGenresToDatabase() directement."
  );
}

export default downloadGenresToDatabase;
