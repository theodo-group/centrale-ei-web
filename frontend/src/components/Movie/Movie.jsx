import './Movie.css';

function Movie({ movies }) {
  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <div
          key={movie.id}
          className="movie-card"
          onClick={() => (window.location.href = `/details/${movie.id}`)}
          style={{ cursor: 'pointer' }}
        >
          <img
            className="movie-image"
            src={'https://image.tmdb.org/t/p/w500' + movie.poster_path}
            alt={movie.title}
          />
          <h3>{movie.title}</h3>
        </div>
      ))}
    </div>
  );
}

export default Movie;
