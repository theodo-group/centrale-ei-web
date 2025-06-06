import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './MovieDetails.css';
import './Buttons.css';

function MovieDetails() {
  const { id: movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [genres, setGenres] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // bouton like
  const [isLiked, setIsLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  //bouton dislike
  const [isDisliked, setIsDisliked] = useState(false);

  // URL du backend
  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
  const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
  const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/w1280';

  // Ajout du style dynamique pour les animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0%, 100% {
          transform: scale(1);
          opacity: 0.8;
        }
        50% {
          transform: scale(1.1);
          opacity: 1;
        }
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      @keyframes thumbsUpSuccess {
        0%, 100% { transform: scale(1) rotate(0deg); }
        25% { transform: scale(1.3) rotate(5deg); }
        50% { transform: scale(1.2) rotate(-5deg); }
        75% { transform: scale(1.1) rotate(3deg); }
      }
      
      @keyframes thumbsDownSuccess {
        0%, 100% { transform: scale(1) rotate(0deg); }
        25% { transform: scale(1.3) rotate(-8deg); }
        50% { transform: scale(1.2) rotate(8deg); }
        75% { transform: scale(1.1) rotate(-5deg); }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Récupération des genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        console.log('Récupération des genres...');
        const response = await axios.get(`${BACKEND_URL}/genres`, {
          timeout: 10000,
        });

        if (response.data && response.data.genres) {
          const genresMap = {};
          response.data.genres.forEach((genre) => {
            genresMap[genre.tmdb_id] = genre.name;
          });
          setGenres(genresMap);
          console.log('Genres récupérés:', genresMap);
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des genres:', err);
      }
    };

    fetchGenres();
  }, [BACKEND_URL]);

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

          // Récupération des états like/dislike depuis localStorage
          const likedMovies = JSON.parse(
            localStorage.getItem('likedMovies') || '[]'
          );
          const dislikedMovies = JSON.parse(
            localStorage.getItem('dislikedMovies') || '[]'
          );

          setIsLiked(likedMovies.includes(parseInt(movieId)));
          setIsDisliked(dislikedMovies.includes(parseInt(movieId)));

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
  }, [movieId, BACKEND_URL]);

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

    // Simulation d'une requête
    await new Promise((resolve) => setTimeout(resolve, 300));

    const likedMovies = JSON.parse(localStorage.getItem('likedMovies') || '[]');
    const dislikedMovies = JSON.parse(
      localStorage.getItem('dislikedMovies') || '[]'
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
        const updatedDislikes = dislikedMovies.filter(
          (id) => id !== movieIdNum
        );
        localStorage.setItem('dislikedMovies', JSON.stringify(updatedDislikes));
        setIsDisliked(false);
      }

      const updatedLikes = [...likedMovies, movieIdNum];
      localStorage.setItem('likedMovies', JSON.stringify(updatedLikes));
      setIsLiked(true);
    }

    setLikeLoading(false);
  };

  // Fonction pour gérer le dislike
  const handleDislike = () => {
    const likedMovies = JSON.parse(localStorage.getItem('likedMovies') || '[]');
    const dislikedMovies = JSON.parse(
      localStorage.getItem('dislikedMovies') || '[]'
    );
    const movieIdNum = parseInt(movieId);

    if (isDisliked) {
      // Retirer le dislike
      const updatedDislikes = dislikedMovies.filter((id) => id !== movieIdNum);
      localStorage.setItem('dislikedMovies', JSON.stringify(updatedDislikes));
      setIsDisliked(false);
    } else {
      // Retirer le like si actif
      if (isLiked) {
        const updatedLikes = likedMovies.filter((id) => id !== movieIdNum);
        localStorage.setItem('likedMovies', JSON.stringify(updatedLikes));
        setIsLiked(false);
      }

      // Ajouter le dislike
      const updatedDislikes = [...dislikedMovies, movieIdNum];
      localStorage.setItem('dislikedMovies', JSON.stringify(updatedDislikes));
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

              <div className="movie-actions">
                {/* Bouton Like Futuriste */}
                <button
                  onClick={handleLike}
                  disabled={likeLoading}
                  className={`futuristic-btn like-btn ${
                    isLiked ? 'active' : ''
                  } ${likeLoading ? 'loading' : ''}`}
                  title={
                    isLiked ? 'Retirer des favoris' : 'Ajouter aux favoris'
                  }
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                  </svg>
                </button>

                {/* Bouton Dislike Futuriste */}
                <button
                  onClick={handleDislike}
                  className={`futuristic-btn dislike-btn ${
                    isDisliked ? 'active' : ''
                  }`}
                  title={isDisliked ? 'Retirer le dislike' : "Je n'aime pas"}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3zm7-13h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 2H17" />
                  </svg>
                </button>
              </div>
            </div>

            {movie.original_title && movie.original_title !== movie.title && (
              <h2 className="movie-original-title">({movie.original_title})</h2>
            )}

            <div className="movie-meta">
              <span className="movie-year meta-tag">
                Date: {formatDate(movie.release_date)}
              </span>

              {movie.runtime && (
                <span className="movie-runtime meta-tag">
                  Durée: {formatRuntime(movie.runtime)}
                </span>
              )}

              {movie.vote_average && (
                <span
                  className={`movie-rating meta-tag ${
                    isHighRating(movie.vote_average) ? 'high-rating' : ''
                  }`}
                >
                  Note: {movie.vote_average}/10
                </span>
              )}

              {movie.vote_count && (
                <span className="movie-votes meta-tag">
                  {formatVotes(movie.vote_count)}
                </span>
              )}

              {movie.popularity && (
                <span className="movie-popularity meta-tag">
                  Pop: {formatPopularity(movie.popularity)}
                </span>
              )}
            </div>

            {/* Genres - avec noms réels */}
            {movie.genre_ids && movie.genre_ids.length > 0 && (
              <div className="movie-genres">
                <h4 className="genres-title">GENRES:</h4>
                <div className="genres-list">
                  {movie.genre_ids.map((genreId) => (
                    <span key={genreId} className="genre-tag">
                      {getGenreName(genreId).toUpperCase()}
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
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
