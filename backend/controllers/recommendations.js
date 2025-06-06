const { getRepository, Not, In } = require('typeorm');
const { Rating } = require('../entities/ratings');
const { Movie } = require('../entities/movies');

async function getUserGenreScores(userId) {
  const ratingRepo = getRepository(Rating);

  // Récupérer les notes avec les films associés (et leurs genres)
  const ratings = await ratingRepo.find({
    where: { userId },
    relations: ['movie', 'movie.genres'],
  });

  const genreScores = {};

  for (const rating of ratings) {
    const movie = rating.movie;

    // Score basé sur l’écart par rapport à la moyenne du film
    const score = (rating.value - movie.voteAverage) / (6 - rating.value);

    // Agrégation des scores par genre
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
  const ratingRepo = getRepository(Rating);
  const movieRepo = getRepository(Movie);

  const genreScores = await getUserGenreScores(userId);

  // Récupérer les IDs de films déjà notés
  const seenRatings = await ratingRepo.find({
    where: { userId },
    select: ['movieId'],
  });
  const seenMovieIds = seenRatings.map(r => r.movieId);

  // Récupérer les films non vus avec leurs genres
  const movies = await movieRepo.find({
    where: seenMovieIds.length > 0 ? { id: Not(In(seenMovieIds)) } : {},
    relations: ['genres'],
  });

  // Calculer un score de compatibilité
  const scoredMovies = movies.map((movie) => {
    let compatibility = 0;
    for (const genre of movie.genres) {
      const gScore = genreScores[genre.id] || 0;
      compatibility += gScore;
    }
    return { ...movie, compatibility };
  });

  // Trier et retourner les meilleurs
  return scoredMovies
    .sort((a, b) => b.compatibility - a.compatibility)
    .slice(0, 20);
}

module.exports = {
  recommendMovies,
};
