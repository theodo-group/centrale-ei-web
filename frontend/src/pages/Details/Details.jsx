// import { useEffect, useState } from 'react';
// import axios from 'axios';
import './Details.css';

const posterURL = 'https://image.tmdb.org/t/p/w500';
// const DEFAULT_FORM_VALUES = {
//   name: '',
// };

const dateFr = new Date('2001-11-16').toLocaleDateString('fr-FR', {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric'
});

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
    <div className="App-content">
      <img
        className="poster"
        src={posterURL + '/fbxQ44VRdM2PVzHSNajUseUteem.jpg'}
        alt="Affiche du film"
      />
      <div className="text-content">
        <h1>Harry Potter à l'école des sorciers</h1>
        <h2>Harry Potter and the Philosopher's Stone</h2>
        <h3>{'Date de sortie : ' + dateFr}</h3>
        <p>
          {
            "Orphelin, le jeune Harry Potter peut enfin quitter ses tyranniques oncle et tante Dursley lorsqu'un curieux messager lui révèle qu'il est un sorcier. À 11 ans, Harry va enfin pouvoir intégrer la légendaire école de sorcellerie de Poudlard, y trouver une famille digne de ce nom et des amis, développer ses dons, et préparer son glorieux avenir."
          }
        </p>
      </div>
    </div>
  );
}

export default Details;
