import '../../pages/Home/Home.css';
export function Movie({ movie }) {
  return (
    <li>
      <p>{movie.title}</p>
      <p>{movie.release_date}</p>
      <p>
        <img
          src={`https://image.tmdb.org/t/p/w500` + movie.poster_path}
          className="image"
          alt={movie.title}
        />
      </p>
    </li>
  );
}
