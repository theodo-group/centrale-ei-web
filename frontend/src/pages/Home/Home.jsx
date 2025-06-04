import { useState, useEffect } from 'react';
import Movie from '../Movie/Movie';
import { useFetchMovies } from './useFetchMovies';
import netflixLogo from './netflix.png';
import introVideo from './Netflics.mp4';
import surprise from './videoplayback.mp4';

function Home() {
  /* ───── états principaux ───── */
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [type, setType] = useState('movie');

  /* intro vidéo */
  const [introEnded, setIntroEnded] = useState(false);

  /* carrousel */
  const moviesPerSlide = 7;
  const [currentSlide, setCurrentSlide] = useState(0);

  /* vidéo surprise */
  const [showVideo, setShowVideo] = useState(false);

  /* reset de la pagination API quand on change de filtre */
  useEffect(() => {
    setPage(1);
    setCurrentSlide(0);
  }, [searchTerm, type]);

  /* récupération des films */
  const { items, loading, error } = useFetchMovies(searchTerm, page, type);

  // Filtrer les items selon le type (film / série)
  const filteredItems = items.filter((item) => {
    if (type === 'movie') {
      // Pour les films, on vérifie s'il y a un titre
      return item.media_type === 'movie' || item.type === 'movie' || item.title;
    } else if (type === 'tv') {
      // Pour les séries, on vérifie s'il y a un nom
      return item.media_type === 'tv' || item.type === 'tv' || item.name;
    }
    return true;
  });

  /* calculs carrousel */
  const totalSlides = Math.max(1, Math.ceil(filteredItems.length / moviesPerSlide));
  const startIdx = currentSlide * moviesPerSlide;
  const endIdx = startIdx + moviesPerSlide;
  const visibleMovies = filteredItems.slice(startIdx, endIdx);

  /* fonction chargement plus */
  function handleLoadMore() {
    setShowVideo(true);
    // On pourrait ici déclencher la pagination après la vidéo ou non selon besoin
  }

  /* fermer vidéo */
  function handleCloseVideo() {
    setShowVideo(false);
    setPage((p) => p + 1); // charge la page suivante après fermeture vidéo
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
      {/* ───── Vidéo d’intro (splash screen) ───── */}
      {!introEnded && (
        <video
          autoPlay
          muted
          playsInline
          onEnded={() => setIntroEnded(true)}
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
            animationDelay: '0.5s', // laisse 0.5 s avant de lancer le fade
          }}
        >
          <source src={introVideo} type="video/mp4" />
          Votre navigateur ne supporte pas les vidéos HTML5.
        </video>
      )}

      {/* ───── Logo Netflix en filigrane ───── */}
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

      {/* ───── Champ de recherche ───── */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: '40px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <h2 style={{ marginBottom: '10px' }}>
          Rechercher votre film, ici :
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
          }}
        />
      </div>

      {/* ───── Boutons Films / Séries ───── */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: '30px',
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
        }}
      >
        <button
          onClick={() => {
            setType('movie');
            setCurrentSlide(0);
          }}
          style={{
            padding: '10px 20px',
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
            padding: '10px 20px',
            fontSize: '1rem',
            borderRadius: '5px',
            border: type === 'tv' ? '2px solid #e50914' : '1px solid #ccc',
            backgroundColor: 'transparent',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          Séries&nbsp;TV
        </button>
      </div>

      {/* ───── Titre de section ───── */}
      <h1
        style={{
          fontSize: '3rem',
          textAlign: 'center',
          marginBottom: '20px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {type === 'movie'
          ? 'Film populaires en ce moment'
          : 'Séries TV populaires en ce moment'}
      </h1>

      {/* ───── Messages de chargement / erreur ───── */}
      {loading && (
        <p
          style={{
            color: 'white',
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
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
          }}
        >
          Erreur lors du chargement {type === 'movie' ? 'des films' : 'des séries'}.
        </p>
      )}

      {/* ───── Carrousel horizontal ───── */}
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
          {/* Flèche gauche */}
          <button
            onClick={() => setCurrentSlide((prev) => Math.max(prev - 1, 0))}
            disabled={currentSlide === 0}
            style={{
              backgroundColor: 'transparent',
              color: currentSlide === 0 ? 'gray' : 'white',
              fontSize: '2rem',
              border: 'none',
              cursor: currentSlide === 0 ? 'default' : 'pointer',
            }}
            aria-label="Précédent"
          >
            ◀
          </button>

          {/* Zone de films visibles */}
          <div
            style={{
              display: 'flex',
              overflow: 'hidden',
              width: 'calc(7 * 180px + 6 * 20px)', // 7 films * largeur + gap * 6
              gap: '20px',
              transition: 'transform 0.5s ease',
            }}
          >
            {visibleMovies.map((item, idx) => (
              <Movie key={item.id} movie={item} rank={startIdx + idx + 1} />
            ))}
          </div>

          {/* Flèche droite */}
          <button
            onClick={() => setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1))}
            disabled={currentSlide >= totalSlides - 1}
            style={{
              backgroundColor: 'transparent',
              color: currentSlide >= totalSlides - 1 ? 'gray' : 'white',
              fontSize: '2rem',
              border: 'none',
              cursor: currentSlide >= totalSlides - 1 ? 'default' : 'pointer',
            }}
            aria-label="Suivant"
          >
            ▶
          </button>
        </div>
      )}

      {/* ───── Aucun film trouvé ───── */}
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
            backgroundColor: '#e50914',
            color: 'white',
          }}
        >
          Voir plus
        </button>
      </div>

      {/* Vidéo fullscreen quand showVideo est true */}
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
              backgroundColor: '#e50914',
              color: 'white',
            }}
          >
            Fermer la vidéo
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;
