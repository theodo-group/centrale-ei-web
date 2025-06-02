import { useEffect, useState } from 'react';
import axios from 'axios';

export function useFetchMovies() {
  const [movies, setMovies] = useState([]);
  const [moviesLoadingError, setMoviesLoadingError] = useState(null);
  const options = {
    method: 'GET',
    url: 'https://api.themoviedb.org/3/trending/movie/day',
    params: {language: 'en-US'},
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo'
    }}
  
  const fetchMovies = () => {
    setMoviesLoadingError(null);

    axios
      .request(options)
      .then(res => {
        console.log(res.data.results); // Vérifiez les données dans la console
        const movieTitles = res.data.results.map(movie => movie.title); // Extrait uniquement les titres des films
        setMovies(movieTitles); // Met à jour l'état avec les titres des films
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return { movies, moviesLoadingError, fetchMovies };
}