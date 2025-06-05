import { useEffect, useState } from 'react';
import './Details.css';
import axios from 'axios';

//"eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo"

console.log('Clé API TMDB :', import.meta.env.VITE_TMDB_API_KEY);
const posterURL = 'https://image.tmdb.org/t/p/w500';

const dateFr = new Date('2001-11-16').toLocaleDateString('fr-FR', {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
});

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

function Details({ movieId }) {
  const [movie, setMovie] = useState(null);
  const [errorCase, setErrorCase] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]); // <-- nouvel état

  useEffect(() => {
    // Récupération du film principal
    axios
      .get(`http://localhost:8000/movies/${movieId}`)
      .then((response) => {
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

    // Appel au backend pour récupérer les films similaires
    //const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    axios
      .get(`http://localhost:8000/movies/${movieId}/similar`)

      .then((response) => {
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
        alt="Affiche du film"
      />
      <div className="text-content">
        <h1>{movie.title}</h1>
        <h3>{'Date de sortie : ' + dateFr}</h3>
        <p>{movie.overview}</p>
        <h4>{'Note des spectateurs : ' + movie.voteAverage}</h4>
        <StarRating storageKey={`noteFilm-${movie.id}`} />
      </div>

      {/* Section films similaires */}
      {similarMovies.length > 0 && (
        <div className="similar-movies">
          <h2>Films similaires</h2>
          <div className="similar-list">
            {similarMovies.map((film) => (
              <div key={film.id} className="similar-item">
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
