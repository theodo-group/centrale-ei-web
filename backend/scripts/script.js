import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import { routeNotFoundJsonHandler } from './services/routeNotFoundJsonHandler.js';
import { jsonErrorHandler } from './services/jsonErrorHandler.js';
import moviesRouter from './routes/movies.js';
import { appDataSource } from './datasource.js';

appDataSource.initialize().then(() => {
  console.log('Data Source has been initialized!');
  const app = express();
});

export function useFetchMovies() {
  const [movies, setMovies] = useState([]);
  const fetchMovies = () => {
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
        console.log(response);
        const films = response.data.results;
        setMovies(films);
      })
      .catch((error) => {
        // Do something if call failed
        console.log(error);
      });
  };
  useEffect(() => fetchMovies(), []);

  return movies;
}

// 1: se connecter à la base de donnée (voir dans server.js)
// call axios pour récupérer une liste de films (voir côté front)
// avec la liste faire un batch insert dans la base de données (internet)
