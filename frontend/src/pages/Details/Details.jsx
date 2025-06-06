import { useContext, useEffect, useState } from 'react';
import './Details.css';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import UserContext from '../../UserContext';

const posterURL = 'https://image.tmdb.org/t/p/w500';

function StarRating({ movieId }) {
  const { selectedUserId } = useContext(UserContext);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const { selectedUserId } = useContext(UserContext);

  const storageKey = `noteFilm-${movieId}-${selectedUserId}`;

  useEffect(() => {
    if (!selectedUserId) {
      return;
    } // ne rien faire si pas d'utilisateur connecté
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setRating(parseFloat(saved));
    } else {
      setRating(0);
    }
  }, [storageKey, selectedUserId]);

  const handleClick = (e, starIndex) => {
    if (!selectedUserId) {
      return;
    } // bloquer si pas d'utilisateur connecté

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

  useEffect(() => {
    if (!selectedUserId || rating === 0 || !movieId) {
      return;
    }

    axios
      .post('/api/ratings', {
        userId: Number(selectedUserId),
        movieId,
        value: rating,
      })
      .then(() => console.log('✅ Note enregistrée'))
      .catch((err) =>
        console.error('❌ Erreur lors de l’envoi de la note', err)
      );
  }, [rating, movieId, selectedUserId]);

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
            style={{ cursor: selectedUserId ? 'pointer' : 'not-allowed' }}
            title={selectedUserId ? '' : 'Veuillez vous connecter pour noter'}
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
  const navigate = useNavigate();
  const { selectedUserId } = useContext(UserContext);

  const [movie, setMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorCase, setErrorCase] = useState(null);

  useEffect(() => {
    if (!movieId) {
      return;
    }

    setLoading(true);
    axios
      .get(`/api/movies/${movieId}`)
      .then((res) => setMovie(res.data))
      .catch(() => setErrorCase('Erreur lors du chargement du film.'))
      .finally(() => setLoading(false));
  }, [movieId]);

  useEffect(() => {
    if (!movieId) {
      return;
    }

    axios
      .get(`https://api.themoviedb.org/3/movie/${movieId}/similar`, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
        },
        params: { language: 'fr-FR' },
      })
      .then((res) => setSimilarMovies(res.data.results || []))
      .catch((err) => {
        console.error('Erreur TMDB :', err.response?.data || err.message);
        setSimilarMovies([]);
      });
  }, [movieId]);

  if (loading) {
    return <div>Chargement...</div>;
  }
  if (errorCase) {
    return <div className="error">{errorCase}</div>;
  }
  if (!movie) {
    return <div>Film introuvable.</div>;
  }

  const dateFr = new Date(movie.releaseDate).toLocaleDateString('fr-FR');

  return (
    <div className="App-content" key={movieId}>
      <img
        className="poster"
        src={
          movie.posterPath ? posterURL + movie.posterPath : '/placeholder.png'
        }
        alt={`Affiche de ${movie.title}`}
      />
      <div className="text-content">
        <h1>{movie.title}</h1>
        <h3>Date de sortie : {dateFr}</h3>
        {movie.genres?.length > 0 && (
          <p>
            <strong>Genres :</strong>{' '}
            {movie.genres.map((g) => g.name).join(', ')}
          </p>
        )}
        <p>{movie.overview}</p>
        <h4>Note des spectateurs : {(movie.voteAverage / 2).toFixed(2)} / 5</h4>

        {movie.id && <StarRating movieId={movie.id} />}
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
                onClick={() => navigate(`/details/${film.id}`)}
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
