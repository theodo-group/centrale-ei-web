import './Movie.css';

export function Movie({ movie }) {
  return (
    <li>
      <p>
        <div class="image-container">
          <a href={`film/${movie.id}`}>
            <img
              src={`https://image.tmdb.org/t/p/w500` + movie.poster_path}
              className="image"
              alt={movie.title}
              class="hover-image"
            />
            <div class="overlay">
              <strong>{movie.title}</strong>
              <br></br>
              <br></br>
              <span class="description">
                {movie.overview.length > 165
                  ? movie.overview
                      .slice(0, 165)
                      .split(' ')
                      .slice(0, -1)
                      .join(' ') + '...'
                  : movie.overview}
              </span>
              <br></br>
              <br></br>
              <strong>{movie.release_date}</strong>{' '}
            </div>
          </a>
        </div>
      </p>
    </li>
  );
}
