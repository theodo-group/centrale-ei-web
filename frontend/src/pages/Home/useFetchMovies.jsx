import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';

export function useFetchMovies() {
  const [movies, setMovies] = useState([]);
  const fetchMovies = (movie = '', page = 1, sortBy = null) => {
    axios
      .get('http://localhost:8000/movies')
      .then((response) => {
        // Do something if call succeeded
        console.log(response);
        const films = response.data.movies;
        setMovies(films);
      })
      .catch((error) => {
        // Do something if call failed
        console.log(error);
      });
  };
  useEffect(() => fetchMovies(), []);

  return { movies, fetchMovies };
}
