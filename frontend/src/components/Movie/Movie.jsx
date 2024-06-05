import './Movie.css';

const Movie = (props) => {

return (
    <div>
      <h3> {props.data["title"]} </h3>
      <h4> {props.data["release_date"]} </h4>
      <img src={`https://image.tmdb.org/t/p/w500${props.data["poster_path"]}`} alt="img"/>
    </div>
);
} ;
export default Movie;