import { useEffect, useState } from 'react'
import './Home.css';
import { useFetchMovies } from './useFetchMovies';


function Home() {
  const [MovieName, setMovieName] = useState('')
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
          {movies.map((title, index) => (
            <li key={index}>{title}</li> // Affiche uniquement le titre de chaque film
          ))}
        </ul>
        
      </header>
    </div>
  );
}

export default Home;