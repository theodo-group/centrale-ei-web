import { useState } from 'react';
import { Movie } from '../../components/Movie/Movie';
import logo from './logo.svg';
import './Home.css';
import { useFetchMovies } from './useFetchMovies';

function Home() {
  const [movieName, setMovieName] = useState('');
  const { movies, fetchMovies } = useFetchMovies();
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('popularity.desc');

  return (
    <div class="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div>Films les plus populaires</div>
        <br />
        <div class="input-container">
          <input
            class="styled-input"
            placeholder="Nom du film"
            value={movieName}
            onChange={(event) => {
              setMovieName(event.target.value);
              fetchMovies(event.target.value, page, sortBy);
            }}
          ></input>
        </div>
        <select
          class="custom-select"
          name="order"
          onChange={(e) => {
            fetchMovies(movieName, page, e.target.value);
            setSortBy(e.target.value);
          }}
        >
          <option value="popularity.desc">Popularité</option>
          <option value="title.asc">Ordre alphabétique</option>
          <option value="primary_release_date.desc">Récent</option>
          <option value="primary_release_date.asc">Ancien</option>
          <option value="vote_average.desc">Note</option>
        </select>
        <select class="custom-select" name="genre">
          <option value="Genre">Genre</option>
          <option value="Aventure">Pertinence</option>
          <option value="Action">Action</option>
        </select>
        <div class="navigation-buttons">
          <button
            class="nav-button previous"
            onClick={() => {
              if (page > 1) {
                fetchMovies(movieName, page - 1, sortBy);
                setPage(page - 1);
              }
            }}
          >
            {' '}
            Page précédente{' '}
          </button>
          Page {page}
          <button
            class="nav-button next"
            onClick={() => {
              fetchMovies(movieName, page + 1, sortBy);
              setPage(page + 1);
            }}
          >
            {' '}
            Page suivante{' '}
          </button>
        </div>
        <p key="title">{movieName}</p>
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
