import axios from 'axios';
import { appDataSource } from './datasource.js';
import Movie from '../entities/movie.js';

appDataSource.initialize().then(() => {
  console.log('Data Source has been initialized!');
});
axios
  .get('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', {
    headers: {
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo',
      accept: 'application/json',
    },
  })
  .then((response) => {
    // Do something if call succeeded
    const films = response.data.results;
    appDataSource
      .createQueryBuilder()
      .insert()
      .into(Movie)
      .values(films.map())
      .execute();
  })
  .catch((error) => {
    // Do something if call failed
    console.log(error);
  });

// 1: se connecter à la base de donnée (voir dans server.js)
// call axios pour récupérer une liste de films (voir côté front)
// avec la liste faire un batch insert dans la base de données (internet)
