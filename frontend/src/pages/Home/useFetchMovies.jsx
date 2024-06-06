import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';

export async function useFetchMovies() {
  const [movies, setMovies] = useState([]);
  const fetchMovies = async (
    movie = '',
    page = 1,
    sortBy = null,
    genre = 'Genre'
  ) => {
    const requests = [
      axios.get('http://localhost:8000/movies'),
      axios.get('http://localhost:8000/genres'),
      axios.get('http://localhost:8000/movie_genres_genre'),
    ];

    const [response1, response2, response3] = await axios.all(requests);

    console.log(response1);
    console.log(response2);
    console.log(response3);
    axios
      .get('http://localhost:8000/movies')
      .then((response) => {
        axios.get('http://localhost:8000/genres').then((resGenre) => {
          // Do something if call succeeded
          let films = response.data.movies;
          films = films.filter((film) => film.title.startsWith(movie));
          setMovies(films);
        });
      })
      .catch((error) => {
        // Do something if call failed
        console.log(error);
      });
  };

  useEffect(() => fetchMovies(), []);

  return { movies, fetchMovies };
}
