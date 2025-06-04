import { useEffect, useState } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './Home.css';
import Movie from '../../components/Movie/Movie';

const DEFAULT_FORM_VALUES = {
  name: '',
};

function Home() {
  const [movieName, setMovieName] = useState(DEFAULT_FORM_VALUES);
  const [movies, setMovies] = useState([]);
  const [sortOption, setSortOption] = useState('popular');

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
        const top10 = response.data.results.slice(0, 18);
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
        <h1>Popcorn Advisor</h1>
      </header>
      <input
        type="text"
        value={movieName.name}
        onChange={(event) =>
          setMovieName({ ...movieName, name: event.target.value })
        }
      ></input>
      <p>{movieName.name}</p>
      <div>
        <label htmlFor="sort">Trier par : </label>
        <select
          id="sort"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="popular">Populaires</option>
          <option value="top_rated">Les mieux notés</option>
          <option value="upcoming">À venir</option>
          <option value="now_playing">En salle</option>
        </select>
      </div>
      <h2>Films populaires du moment :</h2>
      <Movie movies={movies} />
    </div>
  );
}



export default Home;
