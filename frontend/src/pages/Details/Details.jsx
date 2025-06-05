import { useEffect, useState } from 'react';
import './Details.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';


console.log('Clé API TMDB :', import.meta.env.VITE_TMDB_API_KEY);
const posterURL = 'https://image.tmdb.org/t/p/w500';

function StarRating({ storageKey = 'userRating' }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setRating(parseFloat(saved));
    }
  }, [storageKey]);

  const handleClick = (e, starIndex) => {
    const { left, width } = e.target.getBoundingClientRect();
    const x = e.clientX - left;
    const newRating = x < width / 2 ? starIndex + 0.5 : starIndex + 1;

    const final = newRating === rating ? 0 : newRating;
    setRating(final);
    localStorage.setItem(storageKey, final);
  };

  const handleMouseMove = (e, starIndex) => {
    const { left, width } = e.target.getBoundingClientRect();
    const x = e.clientX - left;
    const hover = x < width / 2 ? starIndex + 0.5 : starIndex + 1;
    setHoverRating(hover);
  };

  const displayValue = hoverRating || rating;

  return (
    <div className="star-rating">
      {[...Array(5)].map((_, i) => {
        let className = 'star';
        if (displayValue >= i + 1) {
          className += ' full';
        } else if (displayValue >= i + 0.5) {
          className += ' half';
        }

        return (
          <span
            key={i}
            className={className}
            onClick={(e) => handleClick(e, i)}
            onMouseMove={(e) => handleMouseMove(e, i)}
            onMouseLeave={() => setHoverRating(0)}
            style={{ cursor: 'pointer' }}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}

function Details() {
  const { id: movieId } = useParams();
  console.log('Movie ID from useParams:', movieId);
  const [movie, setMovie] = useState(null);
  const [errorCase, setErrorCase] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);

  console.log('Movie ID from useParams:', movieId);

  useEffect(() => {
    if (!movieId) {
      return;
    }

    console.log(`Déclenche requête axios pour le film ID: ${movieId}`);

    axios
      .get(`/api/movies/${movieId}`) // Proxy vers backend
      .then((response) => {
        console.log('Données film reçues:', response.data);
        setMovie(response.data);
      })
      .catch((error) => {
        console.error('Erreur lors du chargement du film :', error);
        setErrorCase('Erreur lors du chargement du film');
      });
  }, [movieId]);

  useEffect(() => {
    if (!movieId) {
      return;
    }

    console.log(
      `Déclenche requête axios pour films similaires du film ID: ${movieId}`
    );

    axios
      .get(`/api/movies/${movieId}/similar`)
      .then((response) => {
        console.log('Films similaires reçus:', response.data.results);
        setSimilarMovies(response.data.results);
      })
      .catch((error) => {
        console.error(
          'Erreur lors du chargement des films similaires :',
          error
        );
      });
  }, [movieId]);

  if (!movie) {
    return <div>Chargement...</div>;
  }
  if (errorCase) {
    return <div>{errorCase}</div>;
  }
  if (!movie.posterPath) {
    return <div>Pas d'affiche disponible pour ce film.</div>;
  }

  const dateFr = new Date(movie.releaseDate).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });

  return (
    <div className="App-content">
      <img
        className="poster"
        src={posterURL + movie.posterPath}
        alt={`Affiche de ${movie.title}`}
      />
      <div className="text-content">
        <h1>{movie.title}</h1>
        <h3>{'Date de sortie : ' + dateFr}</h3>
        <p>{movie.overview}</p>
        <h4>{'Note des spectateurs : ' + movie.voteAverage}</h4>
        <StarRating storageKey={`noteFilm-${movie.id}`} />
      </div>

      {similarMovies.length > 0 && (
        <div className="similar-movies">
          <h2>Films similaires</h2>
          <div className="similar-list">
            {similarMovies.map((film) => (
              <div
                key={film.id}
                className="similar-item"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  console.log('Film similaire cliqué, ID:', film.id);
                  window.location.href = `/details/${film.id}`;
              }}
>
                <img
                  src={
                    film.poster_path
                      ? posterURL + film.poster_path
                      : '/placeholder.png'
                  }
                  alt={film.title}
                  className="similar-poster"
                />
                <p>{film.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Details;
