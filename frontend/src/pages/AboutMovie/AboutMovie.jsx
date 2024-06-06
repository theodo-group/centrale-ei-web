import axios from 'axios';
import './AboutMovie.css';
import { useParams } from 'react-router-dom';
import { useState } from 'react';

function AboutMovie() {
  const { id } = useParams();
  const [about, setAbout] = useState(<div></div>);
  const [likeActive, setLikeActive] = useState(false);
  const [dislikeActive, setDislikeActive] = useState(false);

  const handleLike = () => {
    setLikeActive(!likeActive);
    if (dislikeActive) {
      setDislikeActive(false);
    }
    //METTRE A JOUR LA DB
  };

  const handleDislike = () => {
    setDislikeActive(!dislikeActive);
    if (likeActive) {
      setLikeActive(false);
    }
    alert('You disliked this!');
    //METTRE A JOUR LA DB
  };

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
          <img
            src={`https://image.tmdb.org/t/p/w500` + movie.poster_path}
            className="image"
            alt={movie.title}
            class="hover-image"
            a
          />
          <strong>{movie.title}</strong>
          <br></br><br></br>
          <span>{movie.overview}</span>

          <div className="button-container">
            <button
              className={`like-button ${likeActive ? 'active' : ''}`}
              onClick={handleLike}
            >
              Like
            </button>
            <button
              className={`dislike-button ${dislikeActive ? 'active' : ''}`}
              onClick={handleDislike}
            >
              Dislike
            </button>
          </div>
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
