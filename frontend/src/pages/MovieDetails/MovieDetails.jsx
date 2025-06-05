import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './MovieDetails.css';

function MovieDetails() {
  const { id: movieId } = useParams(); // Renommé pour clarté
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [genres, setGenres] = useState({}); // Map des genres {tmdb_id: name}
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // bouton like
  const [isLiked, setIsLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  //bouton dislike
  const [isDisliked, setIsDisliked] = useState(false);
  const [dislikes, setDislikes] = useState(0);

  // URL du backend
  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
  const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
  const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/w1280';

  // Récupération des genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        console.log('Récupération des genres...');
        const response = await axios.get(`${BACKEND_URL}/genres`, {
          timeout: 10000,
        });

        if (response.data && response.data.genres) {
          // Créer un map pour un accès rapide par ID
          const genresMap = {};
          response.data.genres.forEach((genre) => {
            genresMap[genre.tmdb_id] = genre.name;
          });
          setGenres(genresMap);
          console.log('Genres récupérés:', genresMap);
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des genres:', err);
        // On continue même si les genres ne se chargent pas
      }
    };

    fetchGenres();
  }, [BACKEND_URL]); // Ajout de BACKEND_URL dans les dépendances

  // Récupération des détails du film
  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log(`Récupération des détails du film ID: ${movieId}`);

        const response = await axios.get(`${BACKEND_URL}/movies/${movieId}`, {
          timeout: 30000,
        });

        if (response.data && response.data.movie) {
          setMovie(response.data.movie);
          // Vérifier si le film est déjà liké
          const likedMovies = JSON.parse(
            localStorage.getItem('likedMovies') || '[]'
          );
          setIsLiked(likedMovies.includes(parseInt(movieId))); // CORRECTION: movieId au lieu de id
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

    if (movieId) {
      fetchMovieDetails();
    }
  }, [movieId, BACKEND_URL]); // Ajout de BACKEND_URL dans les dépendances

  // Fonction pour obtenir le nom d'un genre par son ID
  const getGenreName = (genreId) => {
    return genres[genreId] || `Genre ${genreId}`;
  };

  // Fonction pour déterminer si la note est élevée
  const isHighRating = (rating) => {
    return rating && rating >= 8.0;
  };

  // Fonction pour formater les votes
  const formatVotes = (votes) => {
    if (!votes) {
      return '0 votes';
    }

    if (votes >= 1000000) {
      return `${(votes / 1000000).toFixed(1)}M votes`;
    } else if (votes >= 1000) {
      return `${(votes / 1000).toFixed(1)}k votes`;
    }

    return `${votes.toLocaleString()} votes`;
  };

  // Fonction pour formater la popularité
  const formatPopularity = (popularity) => {
    if (!popularity) {
      return 'N/A';
    }

    return `${popularity.toFixed(0)} pts`;
  };

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

  // Fonction pour gérer le like/unlike
  const handleLike = async () => {
    if (!movie || likeLoading) {
      return;
    }

    setLikeLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const likedMovies = JSON.parse(
        localStorage.getItem('likedMovies') || '[]'
      );
      const movieIdNum = parseInt(movieId);

      if (isLiked) {
        // Retirer des favoris
        const updatedLikes = likedMovies.filter((id) => id !== movieIdNum);
        localStorage.setItem('likedMovies', JSON.stringify(updatedLikes));
        setIsLiked(false);
      } else {
        // Retirer le dislike si actif
        if (isDisliked) {
          setIsDisliked(false);
          setDislikes((prev) => prev - 1);
        }

        const updatedLikes = [...likedMovies, movieId];
        localStorage.setItem('likedMovies', JSON.stringify(updatedLikes));
        setIsLiked(true);
      }
    } catch (err) {
      console.error('Erreur lors de la gestion du like:', err);
    } finally {
      setLikeLoading(false);
    }
  };

  // Fonction pour gérer le dislike
  const handleDislike = () => {
    if (isDisliked) {
      setDislikes((prev) => prev - 1);
      setIsDisliked(false);
    } else {
      // Retirer le like si actif
      if (isLiked) {
        const likedMovies = JSON.parse(
          localStorage.getItem('likedMovies') || '[]'
        );
        const movieId = parseInt(id);
        const updatedLikes = likedMovies.filter((id) => id !== movieId);
        localStorage.setItem('likedMovies', JSON.stringify(updatedLikes));
        setIsLiked(false);
      }
      setDislikes((prev) => prev + 1);
      setIsDisliked(true);
    }
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
            <div className="movie-title-section">
              <h1 className="movie-title">{movie.title}</h1>

              {/* Bouton Like */}
              <button
                onClick={handleLike}
                disabled={likeLoading}
                className={`like-btn ${isLiked ? 'liked' : ''}`}
                title={isLiked ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill={isLiked ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth="2"
                  className="heart-icon"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {likeLoading ? 'Chargement...' : isLiked ? 'Aimé' : "J'aime"}
              </button>
              {/* Bouton Dislike*/}
              <button
                onClick={handleDislike}
                className={`dislike-btn ${isDisliked ? 'active' : ''}`}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2z" />
                </svg>
                {dislikes}
              </button>
            </div>

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
                <span
                  className={`movie-rating ${isHighRating(movie.vote_average) ? 'high-rating' : ''
                    }`}
                >
                  Note: {movie.vote_average}/10
                </span>
              )}

              {movie.vote_count && (
                <span className="movie-votes">
                  {formatVotes(movie.vote_count)}
                </span>
              )}

              {movie.popularity && (
                <span className="movie-popularity">
                  Pop: {formatPopularity(movie.popularity)}
                </span>
              )}
            </div>

            {/* Genres - avec noms réels */}
            {movie.genre_ids && movie.genre_ids.length > 0 && (
              <div className="movie-genres">
                <h4>Genres:</h4>
                <div className="genres-list">
                  {movie.genre_ids.map((genreId) => (
                    <span key={genreId} className="genre-tag">
                      {getGenreName(genreId)}
                    </span>
                  ))}
                </div>
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

          {/* Debug info - à supprimer en production */}
          {process.env.NODE_ENV === 'development' && (
            <div className="detail-section">
              <h3>Debug (Development)</h3>
              <div className="detail-list">
                <p>
                  <strong>Genre IDs:</strong> {JSON.stringify(movie.genre_ids)}
                </p>
                <p>
                  <strong>Genres chargés:</strong> {Object.keys(genres).length}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
