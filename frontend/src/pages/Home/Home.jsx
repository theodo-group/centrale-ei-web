import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { Movie } from '../../components/Movie/Movie';
import logo from './logo.svg';
import './Home.css';
import { useFetchMovies } from './useFetchMovies';

function Home() {
  const [movieName, setMovieName] = useState('');
  const movies = useFetchMovies();

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <div>Films les plus populaires</div>
        <br />
        <input
          value={movieName}
          onChange={(event) => {
            setMovieName(event.target.value);
          }}
        ></input>
        <p>{movieName}</p>
        <div className="movielist">
          {movies.map((movie) => (
            <Movie movie={movie} />
          ))}
        </div>

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
    </div>
  );
}

export default Home;
