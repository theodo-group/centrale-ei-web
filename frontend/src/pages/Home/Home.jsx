import { useState, useEffect } from 'react';
import Movie from '../Movie/Movie';
import { useFetchMovies } from './useFetchMovies';
import netflixLogo from './netflix.png';

function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [type, setType] = useState('movie'); 

  useEffect(() => {
    setPage(1);
  }, [searchTerm, type]);

  const { items, loading, error } = useFetchMovies(searchTerm, page, type);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'grey',
        color: 'white',
        position: 'relative',
        padding: '40px 20px',
        overflowX: 'hidden',
      }}//fond noir
    >
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
        }}// Je te mets un petit logo Netflix
      />

      <div
        style={{
          textAlign: 'center',
          marginBottom: '40px',
          position: 'relative',
          zIndex: 1,
        }}//En haut, design
      >
        <h2 style={{ marginBottom: '10px' }}>Recherche</h2>
        <input
          type="text"
          placeholder={`Rechercher une ${type === 'movie' ? 'film' : 'série'}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '300px',
            padding: '10px',
            fontSize: '1rem',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}//CHoix film ou serie
        />
      </div>

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
          onClick={() => setType('movie')}
          style={{
            padding: '10px 20px',
            fontSize: '1rem',
            borderRadius: '5px',
            border: type === 'movie' ? '2px solid #e50914' : '1px solid #ccc',
            backgroundColor: 'transparent',
            color: 'white',
            cursor: 'pointer',
          }}//Bouton film
        >
          Films
        </button>
        <button
          onClick={() => setType('tv')}
          style={{
            padding: '10px 20px',
            fontSize: '1rem',
            borderRadius: '5px',
            border: type === 'tv' ? '2px solid #e50914' : '1px solid #ccc',
            backgroundColor: 'transparent',
            color: 'white',
            cursor: 'pointer',
          }}// Bouton tv
        >
          Séries TV
        </button>
      </div>

      <h1
        style={{
          fontSize: '3rem',
          textAlign: 'center',
          marginBottom: '20px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {type === 'movie' ? 'Films populaires' : 'Séries TV populaires'}
      </h1>

      {loading && (
        <p
          style={{
            color: 'white',
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          Chargement {type === 'movie' ? 'des films' : 'des séries'}...
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

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {items.length > 0 ? (
          items.map((item, index) => <Movie key={item.id} movie={item} rank={index + 1} />)
        ) : (
          <p
            style={{
              fontStyle: 'italic',
              color: 'white',
              position: 'relative',
              zIndex: 1,
            }}//Donne le rank
          >
            Aucun {type === 'movie' ? 'film' : 'série'} trouvé.
          </p>
        )}
      </div>

      <div
        style={{
          textAlign: 'center',
          marginTop: '30px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={loading}
          style={{
            padding: '10px 20px',
            fontSize: '1rem',
            borderRadius: '5px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: '#e50914',
            color: 'white',
          }}
        >
          Charger plus
        </button>
      </div>
    </div>
  );
}

export default Home;
