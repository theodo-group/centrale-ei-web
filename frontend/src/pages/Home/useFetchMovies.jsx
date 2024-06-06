import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';

export function useFetchMovies(page) {
  const [movieList, setMovieList] = useState([]);
  const [serverUrl, setServerUrl] = useState('https://localhost:3000');
  
  useEffect(() => {
    axios
  .get(`https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`, {headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo'
  }})
  .then((response) => {
		setMovieList(response.data.results);
    console.log(response.data);
  })
  .catch((error) => {
		// Do something if call failed
		console.log(error)
  });
  }, [page]);
  return {movieList}
}