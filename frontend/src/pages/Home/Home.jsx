import logo from './logo.svg';
import './Home.css';
import { useEffect, useState } from 'react';
import { useFetchMovies } from './useFetchMovies.jsx'
import Movie from '../../components/Movie/Movie.jsx';

function Home() {
  const [movieName, setMovieName] = useState('');
  const [page, setPage] = useState(1);
  const {movieList} = useFetchMovies(page);
  //console.log(movieList);
  const listMovies = movieList.map(movie => <Movie key={movie.id} data={movie}/>);
  
  const modifyPage = (c) => {
    if (1 <= page + c ) {
      setPage(page + c);
    }
  }  


  return (
    <div className="App">
        <h1>CINEMATICS</h1>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Qu'allez-vous regarder aujourd'hui ? 
        </p>
        <input placeholder="Rechercher un film" value={movieName} onChange={e => setMovieName(e.target.value)}/>
        <div className="movie-container">
          {listMovies}
        </div> 
        <div className="footer">
          {page !==1 && (<button id="pageMinus" onClick={()=>{modifyPage(-1)}}> &#60; Page précédente </button>)} | <button id="pagePlus" onClick={()=>{modifyPage(1)}}> Page suivante &#62; </button>
        </div>
    </div>
  );
}


export default Home;
