import axios from 'axios';
import './AboutMovie.css';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

function AboutMovie() {
  const { id } = useParams();
  const [likeActive, setLikeActive] = useState(false);
  const [dislikeActive, setDislikeActive] = useState(false);
  const [movie, setMovie] = useState();

  const handleLike = () => {
    setLikeActive(!likeActive);
    if (dislikeActive) {
      setDislikeActive(false);
    }
    axios.post('http://localhost:8000/scores/new', {
      movie_id: id,
      user_id: 1,
      score: 1,
    });
    //METTRE A JOUR LA DB
  };

  const handleDislike = () => {
    setDislikeActive(!dislikeActive);
    if (likeActive) {
      setLikeActive(false);
    }
    alert('You disliked this!');
    axios.post('http://localhost:8000/scores/new', {
      movie_id: id,
      user_id: 1,
      score: -1,
    });
    //METTRE A JOUR LA DB
  };

  useEffect(() => {
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
        setMovie(response.data);
        console.log(response);
      })
      .catch((error) => {
        // Do something if call failed
        console.log(error);
      });
  }, [id]);

  return (
    <div>
      <h1>Détails du Film :</h1>
      <div class="image-about">
        <img
          src={`https://image.tmdb.org/t/p/w500` + movie?.poster_path}
          className="image"
          alt={movie?.title}
          class="hover-image"
        />
      </div>
      <strong>{movie?.title}</strong>
      <br></br>
      <br></br>
      <span>{movie?.overview}</span>
      <br></br>
      <br></br>
      <strong>{'Popularity: ' + movie?.popularity}</strong>
      <br></br>
      <br></br>
      <strong>{'Average Note: ' + movie?.vote_average}</strong>

      <br></br>
      <br></br>
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
}

export default AboutMovie;
