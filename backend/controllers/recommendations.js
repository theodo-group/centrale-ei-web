const prisma = require('../datasource');

async function getUserGenreScores(userId) {
  const ratings = await prisma.ratings.findMany({
    where: { user_id: userId },
    include: { movie: true },
  });

  const genreScores = {};

  for (const rating of ratings) {
    const movie = rating.movie;
    const score = (rating.rating - movie.average_rating) / (6 - rating.rating);

    const movieGenres = await prisma.movie_genre.findMany({
      where: { movie_id: rating.movie_id },
      include: { genre: true },
    });

    for (const mg of movieGenres) {
      const genreId = mg.genre.id;
      if (!genreScores[genreId]) {
        genreScores[genreId] = 0;
      }
      genreScores[genreId] += score;
    }
  }

  return genreScores;
}

async function recommendMovies(userId) {
  const genreScores = await getUserGenreScores(userId);

  const seenRatings = await prisma.ratings.findMany({
    where: { user_id: userId },
    select: { movie_id: true },
  });

  const seenMovieIds = seenRatings.map((r) => r.movie_id);

  const movies = await prisma.movies.findMany({
    where: {
      id: { notIn: seenMovieIds },
    },
    include: {
      genres: {
        include: { genre: true },
      },
    },
  });

  const scoredMovies = movies.map((movie) => {
    let compatibility = 0;

    for (const mg of movie.genres) {
      const gScore = genreScores[mg.genre.id] || 0;
      compatibility += gScore;
    }

    return {
      ...movie,
      compatibility,
    };
  });

  return scoredMovies
    .sort((a, b) => b.compatibility - a.compatibility)
    .slice(0, 20);
}

module.exports = {
  recommendMovies,
};
