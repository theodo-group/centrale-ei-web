import './Movie.css';
export function Movie({ movie }) {
  return (
    <li>
      <p>
        <div class="image-container">
          <a href={`http://localhost:3000/about`}>
            <img
              src={`https://image.tmdb.org/t/p/w500` + movie.poster_path}
              className="image"
              alt={movie.title}
              class="hover-image"
              onClick={() => console.log('bonjour')}
            />
          </a>
          <div class="overlay">
            <strong>{movie.title}</strong>
            <br></br>
            <br></br>
            <span class="description">
              {movie.overview.length > 200
                ? movie.overview
                    .slice(0, 200)
                    .split(' ')
                    .slice(0, -1)
                    .join(' ') + '...'
                : movie.overview}
            </span>
            <br></br>
            <br></br>
            <strong>{movie.release_date}</strong>{' '}
          </div>
        </div>
      </p>
    </li>
  );
}
