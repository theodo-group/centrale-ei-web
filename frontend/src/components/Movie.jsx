import axios from 'axios';
import './Movie.css';

const MovieCards = ({ movie_list }) => {

return (
    <div>
      <table className="movie_card">
        <thead>
          <tr>
            <th>Title</th>
            <th>Release date</th>
            <th>Poster</th>
          </tr>
        </thead>
        <tbody>
          {movie_list.map((movie) => (
            <tr key={movie.title}>
              <td>{movie.release_date}</td>
              <td>{movie.title}</td>
              <td><img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}/></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
);
} ;
export default MovieCards