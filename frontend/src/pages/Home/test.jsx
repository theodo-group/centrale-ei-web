import { useEffect, useState } from 'react';
import axios from 'axios';
import './Home.css';

function Home() {
  const [movieName, setMovieName] = useState('');
  const [submittedMovieName, setSubmittedMovieName] = useState('');
  const [movies, setMovies] = useState([]);

  // Hook de chargement des films populaires
  useEffect(() => {
    axios.get('https://api.themoviedb.org/3/movie/popular', {
      params: { language: 'en-US', page: 1 },
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo',
      },
    })
      .then((response) => {
        setMovies(response.data.results);
      })
      .catch((error) => {
        console.error('Erreur lors du chargement des films :', error);
      });
  }, []);

  // Gère la soumission par touche "Entrée"
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      setSubmittedMovieName(movieName);
    }
  };

  return (
    <div>
      <div className="Home">
        <h1>Liste des films</h1>

        <input
          type="text"
          placeholder="Rechercher un film"
          value={movieName}
          onChange={(e) => setMovieName(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ padding: '8px', fontSize: '16px', marginTop: '16px' }}
        />
      </div>

      <div className="App">
        <header className="App-header">
          <p style={{ fontWeight: 'bold', fontSize: '24px' }}>
            Films All of TIME
          </p>
          {submittedMovieName && <p>{submittedMovieName}</p>}
        </header>
      </div>

      <div style={{ padding: '20px' }}>
        <h2>Films populaires :</h2>
        <ul>
          {movies.map((movie) => (
            <li key={movie.id}>
              {movie.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Home;
