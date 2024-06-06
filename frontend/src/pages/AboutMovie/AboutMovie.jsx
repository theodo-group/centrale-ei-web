import axios from 'axios';
import './AboutMovie.css';
import { useParams } from 'react-router-dom';
import { useState } from 'react';

function AboutMovie() {
  const { id } = useParams();
  const [about, setAbout] = useState(<div></div>);
  axios
    .get(`https://api.themoviedb.org/3/movie/${id}`, {
      headers: {
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo',
        accept: 'application/json',
      },
    })
    .then((response) => {
      // Do something if call succeeded
      const movie = response.data;
      console.log(response);

      setAbout(
        <div>
          <h1>Détails du Film : {id}</h1>
          <p>Film ID: {id}</p>
          <img
            src={`https://image.tmdb.org/t/p/w500` + movie.poster_path}
            className="image"
            alt={movie.title}
            class="hover-image"
          />
          
        </div>
      );
    })
    .catch((error) => {
      // Do something if call failed
      console.log(error);
    });

  return about;
}

export default AboutMovie;
