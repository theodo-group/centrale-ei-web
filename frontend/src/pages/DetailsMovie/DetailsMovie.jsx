import { useParams } from 'react-router-dom';
import './DetailsMovie.css';
import axios from 'axios';
import { useState, useEffect } from 'react';

function DetailsMovie(props) {
    const {idMovie} = useParams();
    const [movieData, setMovieData] = useState({});
    useEffect(() => {
        axios
      .get(`https://api.themoviedb.org/3/movie/${idMovie}`, {headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo'
      }})
    // Fetch movie data for a given id

      .then((response) => {
        setMovieData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
            console.log(error)
      });
      }, []);

    return (
      <div className="details" /*style={{backgroundImage:`url("https://image.tmdb.org/t/p/w500${movieData.backdrop_path}")`}*/>
        <div className="details-image-container">
          <img className="details-image" src={`https://image.tmdb.org/t/p/w500${movieData.poster_path}`} alt="img"/>
        </div>
        <div className="details-info-container">
          <span className="details-title"> {movieData.title} </span> <br/>
          <span className="details-date"> Date de sortie : {movieData.release_date} </span> <br/>
          <span className="details-genre"> 
             {movieData.genres?.map(genre => <span key={genre.id}> -{genre.name}- </span>)} </span> <br/>
          <span className="details-description"> <p>{movieData.overview}</p> </span> <br/>
          <span className="details-duration"> Durée : {movieData.runtime} min </span> <br/>
        </div>
        
        
        
        {/*<span> Bugdet : ${movieData.budget}  </span> <br/>
        
        <span> Langue d'origine : {movieData.original_language} </span> <br/>
        
        

        <img src={`https://image.tmdb.org/t/p/w500${movieData.backdrop_path}`} alt="img"/>
    */}
      </div>
    );
  }
  
  export default DetailsMovie;