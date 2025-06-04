import './Movie.css';

function Movie({ movie }) {
  return (
    <div className="movie-card">
      <img
        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
        alt={movie.title}
        className="movie-poster"
      />
      <h3>{movie.title}</h3>
      <p>Sorti le : {movie.release_date}</p>
    </div>
  );
}

export default Movie;
