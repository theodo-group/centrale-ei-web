import { useState, useEffect } from 'react';
import Movie from '../Movie/Movie';
import { useFetchMovies } from './useFetchMovies';
import netflixLogo from './netflix.png';
import introVideo from './Netflics.mp4';
import surprise from './videoplayback.mp4';
import GENRES from './genres';
import axios from 'axios';
import './Home.css';

function Home({ userId, setUserId}) {

  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [type, setType] = useState('movie');
  const [genre, setGenre] = useState('');
  const [introEnded, setIntroEnded] = useState(false);

  const moviesPerSlide = 7;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  // Vérifie si l'intro a déjà été vue (localStorage)
  useEffect(() => {
    const introAlreadyEnded = localStorage.getItem('introEnded') === 'true';
    setIntroEnded(introAlreadyEnded);
  }, []);

  /* reset de la pagination API quand on change de filtre */
  useEffect(() => {
    setPage(1);
    setCurrentSlide(0);
  }, [searchTerm, type]);

  const { items, loading, error } = useFetchMovies(searchTerm, page, type, genre);

  const filteredItems = items.filter((item) => {
    if (type === 'movie') {
      return item.media_type === 'movie' || item.type === 'movie';
    } else if (type === 'tv') {
      return item.media_type === 'tv' || item.type === 'tv' || item.name;
    }
    return true;
  });

  const totalSlides = Math.max(1, Math.ceil(filteredItems.length / moviesPerSlide));
  const startIdx = currentSlide * moviesPerSlide;
  const endIdx = startIdx + moviesPerSlide;
  const visibleMovies = filteredItems.slice(startIdx, endIdx);

  function handleLoadMore() {
    setShowVideo(true);
  }

  function handleCloseVideo() {
    setShowVideo(false);
    setPage((p) => p + 1);
  }

  const MOVIE_GENRE_IDS = [
    28, 12, 16, 35, 80, 99, 18, 10751, 14, 36, 27, 10402, 9648, 10749, 878, 10770, 53, 10752, 37
  ];
  const TV_GENRE_IDS = [
    10759, 16, 35, 80, 99, 18, 10751, 10762, 9648, 10763, 10764, 10765, 10766, 10767, 10768, 37
  ];
  const genreIdsToShow = type === 'movie' ? MOVIE_GENRE_IDS : TV_GENRE_IDS;
  const filteredGenres = Object.entries(GENRES).filter(([id]) =>
    genreIdsToShow.includes(Number(id))
  );

  // Quand l'intro se termine, on la marque comme vue dans le localStorage
  function handleIntroEnd() {
    setIntroEnded(true);
    localStorage.setItem('introEnded', 'true');
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'black',
        color: 'white',
        position: 'relative',
        padding: '40px 20px',
        overflowX: 'hidden',
      }}
    >
      {/* Header fixe */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          padding: '10px 20px',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          zIndex: 1000,
          transform: 'translateX(4cm)',
          height: '60px',
        }}
      >
        <img
          src={netflixLogo}
          alt="Logo Netflix"
          style={{ height: '40px', cursor: 'pointer', userSelect: 'none' }}
        />
        <div style={{ display: 'flex', gap: '15px' }}>
          <button
            onClick={() => {
              setType('movie');
              setCurrentSlide(0);
            }}
            style={{
              padding: '8px 16px',
              fontSize: '1rem',
              borderRadius: '5px',
              border: type === 'movie' ? '2px solid #e50914' : '1px solid #ccc',
              backgroundColor: 'transparent',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            Films
          </button>
          <button
            onClick={() => {
              setType('tv');
              setCurrentSlide(0);
            }}
            style={{
              padding: '8px 16px',
              fontSize: '1rem',
              borderRadius: '5px',
              border: type === 'tv' ? '2px solid #e50914' : '1px solid #ccc',
              backgroundColor: 'transparent',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            Séries TV
          </button>
        </div>
      </header>

      {/* Vidéo d’intro */}
      {!introEnded && (
        <video
          autoPlay
          muted
          playsInline
          onEnded={handleIntroEnd}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 9999,
            backgroundColor: 'black',
            animation: 'fadeOut 1s ease forwards',
            animationDelay: '0.5s',
          }}
        >
          <source src={introVideo} type="video/mp4" />
          Votre navigateur ne supporte pas les vidéos HTML5.
        </video>
      )}

      {/* Logo en fond */}
      <img
        src={netflixLogo}
        alt="Logo en fond"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 0.8,
          width: '600px',
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 0,
        }}
      />

      {/* Sélecteur d'utilisateur */}
      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <label style={{ marginRight: 10 }}>Utilisateur :</label>
        <select value={userId} onChange={e => setUserId(Number(e.target.value))}>
          <option value={1}>Alice</option>
          <option value={2}>Bob</option>
          <option value={3}>Carol</option>
        </select>
      </div>

      {/* Recommandations personnalisées */}
      <Recommendations userId={userId} />

      {/* Champ de recherche */}
      <div
        style={{
          textAlign: 'center',
          marginTop: '40px',
          marginBottom: '40px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <h2 style={{ marginBottom: '10px' }}>
          Rechercher, ici :
        </h2>
        <input
          type="text"
          placeholder={`Insérer le nom de votre ${
            type === 'movie' ? 'film' : 'série'
          }...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '300px',
            padding: '10px',
            fontSize: '1rem',
            borderRadius: '5px',
            border: '1px solid #ccc',
            boxShadow: '0 2px 12px #e5091440',
            background: '#181818',
            color: 'white',
            outline: 'none',
            transition: 'border 0.2s, box-shadow 0.2s',
          }}
          onFocus={e => e.target.style.border = '2px solid #e50914'}
          onBlur={e => e.target.style.border = '1px solid #ccc'}
        />
      </div>

      {/* Titre de section */}
      <h1
        style={{
          fontSize: '3rem',
          textAlign: 'center',
          marginBottom: '20px',
          position: 'relative',
          zIndex: 1,
          letterSpacing: '2px',
          textShadow: '0 4px 24px #e5091440, 0 2px 8px #000a',
        }}
      >
        {type === 'movie'
          ? 'Films populaires en ce moment'
          : 'Séries TV populaires en ce moment'}
      </h1>

      {/* Messages de chargement / erreur */}
      {loading && (
        <p
          style={{
            color: 'white',
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
            fontSize: '1.2rem',
            letterSpacing: '1px',
          }}
        >
          Chargement {type === 'movie' ? 'des films' : 'des séries'}…
        </p>
      )}

      {error && (
        <p
          style={{
            color: 'red',
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
            fontWeight: 'bold',
          }}
        >
          Erreur lors du chargement {type === 'movie' ? 'des films' : 'des séries'}.
        </p>
      )}

      {/* Filtre par genre */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: '20px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <label style={{ marginRight: '10px' }}>Filtrer par genre :</label>
        <select
          value={genre}
          onChange={e => setGenre(e.target.value)}
          style={{ padding: '8px', borderRadius: '5px' }}
          style={{
            padding: '8px',
            borderRadius: '5px',
            background: '#181818',
            color: 'white',
            border: '1px solid #e50914',
            outline: 'none',
          }}
        >
          <option value="">Tous</option>
          {filteredGenres.map(([id, name]) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </select>
      </div>

      {/* Carrousel horizontal */}
      {filteredItems.length > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            position: 'relative',
            zIndex: 1,
            marginBottom: '30px',
          }}
        >
          <button
            onClick={() => setCurrentSlide((prev) => Math.max(prev - 1, 0))}
            disabled={currentSlide === 0}
            style={{
              backgroundColor: 'transparent',
              color: currentSlide === 0 ? 'gray' : '#e50914',
              fontSize: '2.5rem',
              border: 'none',
              cursor: currentSlide === 0 ? 'default' : 'pointer',
              transition: 'color 0.2s, transform 0.2s',
              transform: currentSlide === 0 ? 'scale(1)' : 'scale(1.2)',
              filter: currentSlide === 0 ? 'none' : 'drop-shadow(0 0 8px #e50914cc)',
            }}
            aria-label="Précédent"
          >
            ◀
          </button>
          <div
            style={{
              display: 'flex',
              overflow: 'hidden',
              width: 'calc(7 * 180px + 6 * 20px)',
              gap: '20px',
              transition: 'transform 0.5s cubic-bezier(.22,1.12,.58,1)',
            }}
          >
            {visibleMovies.map((item, idx) => (
              <Movie key={item.id} movie={item} rank={startIdx + idx + 1} />
            ))}
          </div>
          <button
            onClick={() => setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1))}
            disabled={currentSlide >= totalSlides - 1}
            style={{
              backgroundColor: 'transparent',
              color: currentSlide >= totalSlides - 1 ? 'gray' : '#e50914',
              fontSize: '2.5rem',
              border: 'none',
              cursor: currentSlide >= totalSlides - 1 ? 'default' : 'pointer',
              transition: 'color 0.2s, transform 0.2s',
              transform: currentSlide >= totalSlides - 1 ? 'scale(1)' : 'scale(1.2)',
              filter: currentSlide >= totalSlides - 1 ? 'none' : 'drop-shadow(0 0 8px #e50914cc)',
            }}
            aria-label="Suivant"
          >
            ▶
          </button>
        </div>
      )}

      {/* Aucun film trouvé */}
      {items.length === 0 && !loading && (
        <p
          style={{
            fontStyle: 'italic',
            color: 'white',
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          Aucun {type === 'movie' ? 'film' : 'série'} trouvé.
        </p>
      )}

      {/* Bouton voir plus */}
      <div
        style={{
          textAlign: 'center',
          marginTop: '30px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <button
          onClick={handleLoadMore}
          disabled={loading || showVideo}
          style={{
            padding: '10px 20px',
            fontSize: '1rem',
            borderRadius: '5px',
            border: 'none',
            cursor: loading || showVideo ? 'not-allowed' : 'pointer',
            background: 'linear-gradient(90deg, #e50914 60%, #b0060f 100%)',
            color: 'white',
            fontWeight: 'bold',
            boxShadow: '0 2px 12px #e5091440',
            transition: 'background 0.2s, transform 0.2s',
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.07)'}
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          Voir plus
        </button>
      </div>

      {/* Vidéo surprise */}
      {showVideo && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.9)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            flexDirection: 'column',
          }}
        >
          <video
            src={surprise}
            controls
            autoPlay
            style={{ maxWidth: '80%', maxHeight: '80%', borderRadius: '10px' }}
            onEnded={handleCloseVideo}
          />
          <button
            onClick={handleCloseVideo}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              fontSize: '1rem',
              borderRadius: '5px',
              border: 'none',
              cursor: 'pointer',
              background: 'linear-gradient(90deg, #e50914 60%, #b0060f 100%)',
              color: 'white',
              fontWeight: 'bold',
              boxShadow: '0 2px 12px #e5091440',
              transition: 'background 0.2s, transform 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.07)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            Fermer la vidéo
          </button>
        </div>
      )}
    </div>
  );
}

function Recommendations({ userId }) {
  const [reco, setReco] = useState([]);
  useEffect(() => {
    axios.get(`http://localhost:8000/recommendations?user_id=${userId}`)
      .then(res => setReco(res.data));
  }, [userId]);
  return (
    <div>
      <h2>Recommandé pour vous</h2>
      <div style={{ display: 'flex', gap: 20 }}>
        {reco.map(movie => (
          <Movie key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

export default Home;