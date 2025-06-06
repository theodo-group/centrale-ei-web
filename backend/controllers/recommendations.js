const { getRepository, Not, In } = require('typeorm');
const { Rating } = require('../entities/ratings');
const { Movie } = require('../entities/movies');
const { appDataSource } = require('../datasource.js');

async function getUserGenreScores(userId) {
  const ratingRepo = appDataSource.getRepository(Rating);

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

  // Si l'utilisateur n'a aucune note, on peut renvoyer une liste vide ou des recommandations génériques (au choix)
  if (Object.keys(genreScores).length === 0) {
    // Par exemple, on renvoie une liste vide :
    return [];
    // Ou bien une liste des films les plus populaires (exemple) :
    // return await movieRepo.find({ order: { popularity: 'DESC' }, take: 20 });
  }

  const seenRatings = await ratingRepo.find({
    where: { user: { id: userId } },
    relations: ['movie'],
  });
  const seenMovieIds = seenRatings.map((r) => r.movie.id);

  const movies = await movieRepo.find({
    where: seenMovieIds.length > 0 ? { id: Not(In(seenMovieIds)) } : {},
    relations: ['genres'],
  });

  const scoredMovies = movies.map((movie) => {
    let compatibility = 0;
    for (const genre of movie.genres) {
      const gScore = genreScores[genre.id] || 0;
      compatibility += gScore;
    }

    return { ...movie, compatibility };
  });

  return scoredMovies
    .sort((a, b) => b.compatibility - a.compatibility)
    .slice(0, 20);
}

module.exports = {
  recommendMovies,
};
