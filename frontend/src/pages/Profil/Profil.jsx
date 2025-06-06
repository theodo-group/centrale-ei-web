import './Profil.css';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import UserContext from '../../UserContext.jsx'; // adapte le chemin

const posterURL = 'https://image.tmdb.org/t/p/w500';

function Profil() {
  const { selectedUserId } = useContext(UserContext);
  const [ratedMovies, setRatedMovies] = useState([]);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [loadingUser, setLoadingUser] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!selectedUserId) {
      return;
    }

    const userId = Number(selectedUserId);
    setLoadingUser(true);
    setLoadingMovies(true);

    // Requête pour récupérer les infos utilisateur
    axios
      .get(`http://localhost:8000/users/${userId}`)
      .then((res) => {
        console.log('User data:', res.data);
        setUser(res.data);
        setLoadingUser(false);
      })
      .catch((err) => {
        console.error('Erreur chargement utilisateur :', err);
        setLoadingUser(false);
      });

    // Requête pour récupérer les films notés
    axios
      .get(`http://localhost:8000/ratings/${userId}`)
      .then((res) => {
        setRatedMovies(res.data);
        setLoadingMovies(false);
      })
      .catch((err) => {
        console.error('Erreur chargement films notés :', err);
        setLoadingMovies(false);
      });
  }, [selectedUserId]);

  if (!selectedUserId) {
    return <p>Aucun utilisateur sélectionné.</p>;
  }

  if (loadingUser || loadingMovies) {
    return <p>Chargement...</p>;
  }

  if (!user) {
    return <p>Utilisateur introuvable.</p>;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <img src="/chat.jpg" alt="Avatar" className="profile-avatar" />
        <h1>
          {user.firstname} {user.lastname}
        </h1>
      </div>

      <div className="profile-section">
        <h2>Films notés :</h2>

        {ratedMovies.length === 0 ? (
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
