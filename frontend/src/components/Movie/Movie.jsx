import React from 'react';

function Movie({ movie }) {
  // URL de base pour les images TMDB
  const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

  return (
    <div className="movie-item">
      {movie.poster_path && (
        <img
          src={`${imageBaseUrl}${movie.poster_path}`}
          alt={movie.title || 'Affiche du film'}
          className="movie-poster"
        />
      )}
      <div className="movie-info">
        <h3>{movie.title || 'Titre indisponible'}</h3>
        <p>Date de sortie : {movie.release_date || 'Date indisponible'}</p>
        {movie.overview && <p className="movie-overview">{movie.overview}</p>}
        {movie.vote_average > 0 && (
          <p className="movie-rating">⭐ {movie.vote_average.toFixed(2)}/10</p>
        )}
      </div>
    </div>
  );
}

export default Movie;
