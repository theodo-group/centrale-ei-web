import logo from './logo.svg';
import './Home.css';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import useFetchMovies from './useFetchMovies';
import Movie from '../../components/Movie/Movie';
import Carrousel from '../../components/Carrousel/Carrousel';
import CategorySection from '../../components/Categories/CategorySection';
import RecommendationSection from '../../components/RecommendationSection/RecommendationSection';

function Home() {
  const [movieName, setMovieName] = useState('');
  const movies = useFetchMovies();
  const moviesNames = movies.map((movie) => movie.title);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          recherche un film :
          <input
            className="Barre-recherche"
            type="text"
            placeholder="Rechercher"
            value={movieName}
            onChange={(event) => {
              setMovieName(event.target.value);
            }}
          />
        </p>
        <h1>Voici les {movies.length} films les plus populaires</h1>
        {/* {moviesNames.map((titre)=>(<li>{titre}</li>))} */}
        <table>
          <tr>
            <td>
              <h4>Affiche</h4>
            </td>
            <td>
              <h3>Titre</h3>
            </td>
            <td>
              <h3>Date de sortie</h3>
            </td>
          </tr>
        </table>
        {movies.map((movie) => (
          <Movie movie={movie} />
        ))}
        <Carrousel movies={movies} />
        <CategorySection /> 
        <RecommendationSection recommendations={movies} />
      </header>
    </div>
  );
}

export default Home;
