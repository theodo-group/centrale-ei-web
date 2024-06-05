import logo from './logo.svg';
import './Home.css';
import { useState } from 'react';
import {useFetchMovies} from './useFetchMovies.jsx'
import Movie from '../../components/Movie/Movie.jsx';

function Home() {
  const [movie_name, set_movie_name] = useState('');
  const {movie_list} = useFetchMovies();
  console.log(movie_list);
  const listMovies = movie_list.map(movie => <Movie key={movie.id} data={movie}/>);
  
  return (
    <div className="App">
      <header className="App-header">
        <h1>CINEMATICS</h1>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Qu'allez-vous regarder aujourd'hui ? 
        </p>
        <input className="search" name="Nom de Film" value={movie_name} onChange={e => set_movie_name(e.target.value)}/>
        <div className="movie-container">
          {listMovies}
        </div> 
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
