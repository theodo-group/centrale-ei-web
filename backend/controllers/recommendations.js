const { getRepository, Not, In } = require('typeorm');
const { Rating } = require('../entities/ratings');
const { Movie } = require('../entities/movies');
const { appDataSource } = require('../datasource.js');

async function getUserGenreScores(userId) {
  const ratingRepo =appDataSource.getRepository(Rating);

  // Trouver les notes du user avec films et genres associés
  const ratings = await ratingRepo.find({
    where: { user: { id: userId } },
    relations: ['movie', 'movie.genres'],
  });

  const genreScores = {};

  for (const rating of ratings) {
    const movie = rating.movie;

    // Calcul du score basé sur la note et la moyenne du film
    const score = (rating.value - movie.voteAverage) / (6 - rating.value);

    for (const genre of movie.genres) {
      const genreId = genre.id;
      if (!genreScores[genreId]) {
        genreScores[genreId] = 0;
      }
      genreScores[genreId] += score;
    }
  }

  return genreScores;
}

async function recommendMovies(userId) {
  const ratingRepo = appDataSource.getRepository(Rating);
  const movieRepo = appDataSource.getRepository(Movie);

  const genreScores = await getUserGenreScores(userId);

  // Récupérer les films déjà notés (via relation)
  const seenRatings = await ratingRepo.find({
    where: { user: { id: userId } },
    relations: ['movie'],
  });
  const seenMovieIds = seenRatings.map(r => r.movie.id);

  // Récupérer les films non vus avec leurs genres
  const movies = await movieRepo.find({
    where: seenMovieIds.length > 0 ? { id: Not(In(seenMovieIds)) } : {},
    relations: ['genres'],
  });

  // Calcul du score de compatibilité par genres
  const scoredMovies = movies.map(movie => {
    let compatibility = 0;
    for (const genre of movie.genres) {
      const gScore = genreScores[genre.id] || 0;
      compatibility += gScore;
    }
    return { ...movie, compatibility };
  });

  // Retourner les 20 meilleurs triés par compatibilité décroissante
  return scoredMovies
    .sort((a, b) => b.compatibility - a.compatibility)
    .slice(0, 20);
}

module.exports = {
  recommendMovies,
};
