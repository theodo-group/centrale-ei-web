// import { useEffect, useState } from 'react';
// import axios from 'axios';
import './Details.css';

const posterURL = 'https://image.tmdb.org/t/p/w500';
// const DEFAULT_FORM_VALUES = {
//   name: '',
// };
function Details() {
  // const [movieName, setMovieName] = useState(DEFAULT_FORM_VALUES);
  // const [movies, setMovies] = useState([]);

  // useEffect(() => {
  //   console.log('Le composant Home est monté');

  //   axios
  //     .request(options)
  //     .then((response) => {
  //       console.log('axios connected');
  //       const top10 = response.data.results.slice(0, 10);
  //       setMovies(top10);
  //       console.log('Films reçus via axios :', top10);
  //     })
  //     .catch((error) => {
  //       console.error('Erreur lors de l’appel à l’API TMDB :', error);
  //     });
  // }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Harry Potter à l'école des sorciers</h1>
      </header>
      <h2>Harry Potter and the Philosopher's Stone</h2>
      <img src={posterURL + '/fbxQ44VRdM2PVzHSNajUseUteem.jpg'}></img>
      <h3>{'Date de sortie : ' + '2001-11-16'}</h3>
      <p>
        {
          "Orphelin, le jeune Harry Potter peut enfin quitter ses tyranniques oncle et tante Dursley lorsqu'un curieux messager lui révèle qu'il est un sorcier. À 11 ans, Harry va enfin pouvoir intégrer la légendaire école de sorcellerie de Poudlard, y trouver une famille digne de ce nom et des amis, développer ses dons, et préparer son glorieux avenir."
        }
      </p>
    </div>
  );
}

export default Details;
