import { useEffect, useState } from 'react';
import axios from 'axios';
import './Details.css';

const DEFAULT_FORM_VALUES = {
  name: '',
};
function Details() {
  const [movieName, setMovieName] = useState(DEFAULT_FORM_VALUES);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    console.log('Le composant Home est monté');
    const options = {
      method: 'GET',
      url: 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo',
      },
    };

    axios
      .request(options)
      .then((response) => {
        console.log('axios connected');
        const top10 = response.data.results.slice(0, 10);
        setMovies(top10);
        console.log('Films reçus via axios :', top10);
      })
      .catch((error) => {
        console.error('Erreur lors de l’appel à l’API TMDB :', error);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Recommendation de films</h1>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.jsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://react.dev"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <input
        type="text"
        value={movieName.name}
        onChange={(event) =>
          setMovieName({ ...movieName, name: event.target.value })
        }
      ></input>
      <p>{movieName.name}</p>

      <h2>Top 10 des films populaires :</h2>
      <Movie movies={movies} />
    </div>
  );
}

export default Home;
