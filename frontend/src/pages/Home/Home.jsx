import { useState } from 'react';
import './Home.css';
import { useFetchMovies } from './useFetchMovies';
import Movie from '../../components/Movie/Movie.jsx';

function Home() {
  const [MovieName, setMovieName] = useState('');
  const { movies, moviesLoadingError, fetchMovies } = useFetchMovies();

  return (
    <div className="App">
      <header className="App-header">
        <h1>Liste Films </h1>
        <input
          type="text"
          placeholder="Rechercher un film..."
          value={MovieName}
          onChange={(event) => setMovieName(event.target.value)}
        />
        <p>{MovieName}</p>
        <p>Liste des films :</p>
        <ul>
          {movies.map((movie, index) => (
            <li key={index}>
              <Movie movie={movie} />
            </li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default Home;
