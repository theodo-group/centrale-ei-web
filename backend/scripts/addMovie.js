require('dotenv').config();
require('reflect-metadata');
const { appDataSource } = require('../datasource.js');
const { Movie } = require('../entities/movies.js');

// Fonction pour parser les arguments de la ligne de commande
function parseArgs() {
  const args = process.argv.slice(2); // Ignore 'node' et le fichier
  const movieData = {};

  for (const arg of args) {
    const [key, value] = arg.replace(/^--/, '').split('=');
    if (!key || !value) continue;

    if (key === 'id') {
      movieData.id = Number(value);
    } else if (key === 'releaseDate') {
      movieData.releaseDate = new Date(value);
    } else {
      movieData[key] = value;
    }
  }

  return movieData;
}

async function addMovie(movieData) {
  await appDataSource.initialize();
  const movieRepository = appDataSource.getRepository(Movie);

  try {
    const newMovie = movieRepository.create(movieData);
    const savedMovie = await movieRepository.save(newMovie);
    console.log('Movie successfully created, id:', savedMovie.id);
  } catch (error) {
    console.error('Error while creating the movie:', error.message);
    if (error.code === 'SQLITE_CONSTRAINT' || error.code === '23505') {
      console.error(`Movie with id "${movieData.id}" already exists`);
    }
  } finally {
    await appDataSource.destroy();
  }
}

async function run() {
  const movieData = parseArgs();

  if (!movieData.title || !movieData.releaseDate) {
    console.error(
      'Usage: node addMovie.js --title="..." --releaseDate="YYYY-MM-DD" [--id=...]'
    );
    process.exit(1);
  }

  await addMovie(movieData);
}

run();

// Exemple command console (niveau backend)
// node addMovie.js --id=123 --title="Mon Film" --releaseDate="2024-01-01"
// node addMovie.js --title="Film Auto-ID" --releaseDate="2025-01-01"
