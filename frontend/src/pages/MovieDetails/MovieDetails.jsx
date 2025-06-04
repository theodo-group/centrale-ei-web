import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './MovieDetails.css';

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // URL du backend
  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
  const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
  const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/w1280';

  // Récupération des détails du film
  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log(`Récupération des détails du film ID: ${id}`);

        const response = await axios.get(`${BACKEND_URL}/movies/${id}`, {
          timeout: 30000,
        });

        if (response.data && response.data.movie) {
          setMovie(response.data.movie);
          console.log('Détails du film récupérés:', response.data.movie);
        } else {
          throw new Error('Film non trouvé');
        }
      } catch (err) {
        console.error('Erreur lors de la récupération du film:', err);

        if (err.response?.status === 404) {
          setError('Film non trouvé');
        } else if (err.response?.status >= 500) {
          setError('Erreur serveur');
        } else {
          setError('Erreur lors du chargement du film');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovieDetails();
    }
  }, [id]);

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    if (!dateString) {
      return 'Date inconnue';
    }

    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Fonction pour formater la durée
  const formatRuntime = (minutes) => {
    if (!minutes) {
      return 'Durée inconnue';
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    return `${hours}h ${mins}min`;
  };

  // Fonction pour formater le budget/revenue
  const formatMoney = (amount) => {
    if (!amount || amount === 0) {
      return 'Non disponible';
    }

    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="movie-details-container">
        <div className="loading-container">
          <p>Chargement des détails du film...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="movie-details-container">
        <div className="error-container">
          <h2>Erreur</h2>
          <p>{error}</p>
          <div className="error-actions">
            <button onClick={() => navigate(-1)} type="button">
              Retour
            </button>
            <Link to="/" className="home-link">
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="movie-details-container">
        <div className="error-container">
          <h2>Film non trouvé</h2>
          <Link to="/" className="home-link">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="movie-details-container">
      {/* Image de fond */}
      {movie.backdrop_path && (
        <div
          className="movie-backdrop"
          style={{
            backgroundImage: `url(${BACKDROP_BASE_URL}${movie.backdrop_path})`,
          }}
        />
      )}

      {/* Navigation */}
      <div className="movie-nav">
        <button onClick={() => navigate(-1)} className="back-btn">
          Retour
        </button>
        <Link to="/" className="home-link">
          Accueil
        </Link>
      </div>

      {/* Contenu principal */}
      <div className="movie-details-content">
        <div className="movie-header">
          {/* Poster */}
          <div className="movie-poster-container">
            <img
              src={
                movie.poster_path
                  ? `${IMAGE_BASE_URL}${movie.poster_path}`
                  : '/default-poster.jpg'
              }
              alt={movie.title}
              className="movie-poster-large"
            />
          </div>

          {/* Informations principales */}
          <div className="movie-main-info">
            <h1 className="movie-title">{movie.title}</h1>

            {movie.original_title && movie.original_title !== movie.title && (
              <h2 className="movie-original-title">({movie.original_title})</h2>
            )}

            <div className="movie-meta">
              <span className="movie-year">
                Date: {formatDate(movie.release_date)}
              </span>

              {movie.runtime && (
                <span className="movie-runtime">
                  Durée: {formatRuntime(movie.runtime)}
                </span>
              )}

              {movie.vote_average && (
                <span className="movie-rating">
                  Note: {movie.vote_average}/10
                </span>
              )}

              {movie.vote_count && (
                <span className="movie-votes">
                  {movie.vote_count.toLocaleString()} votes
                </span>
              )}
            </div>

            {/* Genres - si disponibles */}
            {movie.genre_ids && movie.genre_ids.length > 0 && (
              <div className="movie-genres">
                {movie.genre_ids.map((genreId) => (
                  <span key={genreId} className="genre-tag">
                    Genre {genreId}
                  </span>
                ))}
              </div>
            )}

            {/* Synopsis */}
            {movie.overview && (
              <div className="movie-overview-section">
                <h3>Synopsis</h3>
                <p className="movie-overview-full">{movie.overview}</p>
              </div>
            )}
          </div>
        </div>

        {/* Informations détaillées */}
        <div className="movie-details-grid">
          {/* Informations générales */}
          <div className="detail-section">
            <h3>Informations générales</h3>
            <div className="detail-list">
              <p>
                <strong>ID:</strong> {movie.id}
              </p>
              <p>
                <strong>Type de média:</strong> {movie.media_type || 'Film'}
              </p>
              <p>
                <strong>ID TMDB:</strong> {movie.tmdb_id}
              </p>
              <p>
                <strong>Langue originale:</strong> {movie.original_language}
              </p>
              <p>
                <strong>Popularité:</strong>{' '}
                {movie.popularity?.toFixed(1) || 'N/A'}
              </p>
            </div>
          </div>

          {/* Statistiques */}
          <div className="detail-section">
            <h3>Statistiques</h3>
            <div className="detail-list">
              <p>
                <strong>Note moyenne:</strong> {movie.vote_average}/10
              </p>
              <p>
                <strong>Nombre de votes:</strong>{' '}
                {movie.vote_count?.toLocaleString()}
              </p>
              <p>
                <strong>Popularité:</strong> {movie.popularity}
              </p>
            </div>
          </div>

          {/* Informations techniques */}
          <div className="detail-section">
            <h3>Détails techniques</h3>
            <div className="detail-list">
              <p>
                <strong>Poster:</strong>{' '}
                {movie.poster_path ? 'Disponible' : 'Non disponible'}
              </p>
              <p>
                <strong>Image de fond:</strong>{' '}
                {movie.backdrop_path ? 'Disponible' : 'Non disponible'}
              </p>
              {movie.runtime && (
                <p>
                  <strong>Durée:</strong> {movie.runtime} minutes
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
