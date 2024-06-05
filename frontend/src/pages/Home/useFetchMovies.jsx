import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';

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
