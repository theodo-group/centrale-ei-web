import './Profil.css';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import UserContext from '../../UserContext.jsx'; // adapte le chemin

const posterURL = 'https://image.tmdb.org/t/p/w500';

function Profil() {
  const { selectedUserId } = useContext(UserContext);
  const [ratedMovies, setRatedMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedUserId) {
      setLoading(false);

      return;
    }

    const userId = Number(selectedUserId);
    if (isNaN(userId)) {
      console.error('User ID invalide:', selectedUserId);
      setLoading(false);

      return;
    }

    setLoading(true);
    axios
      .get(`http://localhost:8000/ratings/${userId}`)
      .then((res) => {
        setRatedMovies(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erreur lors du chargement des films notés :', err);
        setLoading(false);
      });
  }, [selectedUserId]);

  if (!selectedUserId) {
    return <p>Chargement des informations utilisateur...</p>;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        {/* Si tu as l’avatar dans les données utilisateur, adapte ici */}
        <img src="/chat.jpg" alt="Avatar" className="profile-avatar" />
        <h1>Utilisateur ID : {selectedUserId}</h1>
      </div>

      <div className="profile-section">
        <h2>Films notés :</h2>

        {loading ? (
          <p>Chargement...</p>
        ) : ratedMovies.length === 0 ? (
          <p>Vous n'avez encore noté aucun film.</p>
        ) : (
          <div className="profile-movie-list">
            {ratedMovies.map((movie) => (
              <div key={movie.id} className="profile-movie-item">
                <img
                  src={posterURL + movie.poster_path}
                  alt={movie.title}
                  className="profile-movie-poster"
                />
                <p>{movie.title}</p>
                <p className="movie-rating">Note : {movie.rating}/5</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profil;
