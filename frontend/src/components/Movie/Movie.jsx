import './Movie.css';

function Movie({ movies }) {
  const posterURL = 'https://image.tmdb.org/t/p/w500';

  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <div className="movie-card" key={movie.id}>
          <img
            src={posterURL + movie.poster_path}
            alt={movie.title}
            className="movie-image"
          />
          <div className="movie-info">
            <h3>{movie.title}</h3>
            <p>
              Date de sortie :{' '}
              {new Date(movie.release_date).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Movie;
