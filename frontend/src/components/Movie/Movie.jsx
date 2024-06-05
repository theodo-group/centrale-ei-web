import { Link } from 'react-router-dom';
import './Movie.css';

const Movie = ({data}) => {

  return (
      <Link to={`/details/${data.id}`}>
        <h3> {data.title} </h3>
        <h4> {data.release_date} </h4>
        <img src={`https://image.tmdb.org/t/p/w500${data.poster_path}`} alt="img"/>
      </Link>
  );
} ;
export default Movie;