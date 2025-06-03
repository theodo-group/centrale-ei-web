const posterURL = 'https://image.tmdb.org/t/p/w500';

function Movie({ movies }) {
  return (
    <div>
      <table className="movies-table">
        <thead>
          <tr>
            <th>Titre</th>
            <th>Date de Sortie</th>
            <th>Affiche</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie) => (
            <tr key={movie.id}>
              <td>{movie.title}</td>
              <td>{movie.release_date}</td>
              <td>
                <img src={posterURL + movie.poster_path}></img>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Movie;