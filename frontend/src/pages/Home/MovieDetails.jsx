import { useState, useEffect } from 'react';
import axios from 'axios';

function MovieDetails({ movieId, type = 'movie', onClose }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    axios
      .get(`https://api.themoviedb.org/3/${type}/${movieId}`, {
        headers: {
          accept: 'application/json',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo',
        },
      })
      .then((response) => {
        setDetails(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [movieId, type]);

  if (loading)
    return (
      <div
        style={{
          position: 'fixed',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0,0,0,0.9)',
          color: 'white',
          padding: '20px',
          borderRadius: '10px',
          zIndex: 100,
          maxWidth: '600px',
          textAlign: 'center',
        }}
      >
        Chargement des détails...
      </div>
    );

  if (error)
    return (
      <div
        style={{
          position: 'fixed',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0,0,0,0.9)',
          color: 'red',
          padding: '20px',
          borderRadius: '10px',
          zIndex: 100,
          maxWidth: '600px',
          textAlign: 'center',
        }}
      >
        Erreur lors du chargement des détails.
        <br />
        <button
          onClick={onClose}
          style={{
            marginTop: '10px',
            cursor: 'pointer',
            padding: '8px 16px',
            backgroundColor: '#e50914',
            border: 'none',
            borderRadius: '5px',
            color: 'white',
          }}
        >
          Fermer
        </button>
      </div>
    );

  return (
    <div
      style={{
        position: 'fixed',
        top: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(0,0,0,0.95)',
        color: 'white',
        padding: '30px',
        borderRadius: '10px',
        zIndex: 100,
        maxWidth: '700px',
        maxHeight: '80vh',
        overflowY: 'auto',
        boxShadow: '0 0 20px #e50914',
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          cursor: 'pointer',
          padding: '5px 10px',
          backgroundColor: '#e50914',
          border: 'none',
          borderRadius: '5px',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '1rem',
        }}
      >
        ×
      </button>
      <h2>{details.title || details.name}</h2>
      <p><strong>Résumé :</strong> {details.overview}</p>
      <p><strong>Date de sortie :</strong> {details.release_date || details.first_air_date}</p>
      <p><strong>Note moyenne :</strong> {details.vote_average}</p>
      <p><strong>Nombre de votes :</strong> {details.vote_count}</p>
      {details.genres && (
        <p>
          <strong>Genres :</strong> {details.genres.map(g => g.name).join(', ')}
        </p>
      )}
      {details.runtime && <p><strong>Durée :</strong> {details.runtime} minutes</p>}
      {details.number_of_seasons && <p><strong>Saisons :</strong> {details.number_of_seasons}</p>}
      {details.number_of_episodes && <p><strong>Épisodes :</strong> {details.number_of_episodes}</p>}
      {details.poster_path && (
        <img
          src={`https://image.tmdb.org/t/p/w300${details.poster_path}`}
          alt={details.title || details.name}
          style={{ borderRadius: '8px', marginTop: '15px', maxWidth: '100%' }}
        />
      )}
    </div>
  );
}

export default MovieDetails;
