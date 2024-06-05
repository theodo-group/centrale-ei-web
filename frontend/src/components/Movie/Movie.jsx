import { Link } from 'react-router-dom';
import './Movie.css';

const Movie = ({data}) => {

  return (
      <Link className="movie-card" to={`/details/${data.id}`}>
        <img className="movie-image" src={`https://image.tmdb.org/t/p/w500${data.poster_path}`} alt="img"/>
        {/*<h3 className="movie-title"> {data.title} </h3>
        <h4 className="movie-date"> {data.release_date} </h4>*/}
      </Link>
  );
} ;
export default Movie;