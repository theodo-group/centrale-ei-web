import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';

export function useFetchMovies(
  search_name = '',
  page_requested = 1,
  sortBy_requested = null,
  genre_requested
) {
  const [movies, setMovies] = useState([]);
  const fetchMovies = (movie, page, sortBy, genre) => {
    let url = 'http://localhost:8000/movies';
    axios.get('http://localhost:8000/score_movies').then((score_movies) => {
      if (genre) {
        url = url + `?genre=${genre}`;
      }
      axios
        .get(url)
        .then((response) => {
          // Do something if call succeeded
          console.log(response);
          let films = response.data.movies;
          films = films.filter((film) => {
            return (
              film.title &&
              film.title.toLowerCase().startsWith(movie.toLowerCase())
            );
          });
          console.log(films);
          console.log(movie);
          films = films.filter(
            (film) =>
              genre === 'Genre' ||
              film.genres
                .map((film_genre) => film_genre.genre_name)
                .includes(genre)
          );
          console.log(score_movies.data.scoreMovies);
          films = films.sort((film1, film2) => {
            if (sortBy === 'popularity.desc') {
              return film2.popularity - film1.popularity;
            }
            if (sortBy === 'title.asc') {
              return film1.title.toLowerCase() < film2.title.toLowerCase()
                ? -1
                : 1;
            }
            if (sortBy === 'primary_release_date.desc') {
              return (
                new Date(film2.release_date) - new Date(film1.release_date)
              );
            }
            if (sortBy === 'primary_release_date.asc') {
              return (
                new Date(film1.release_date) - new Date(film2.release_date)
              );
            }
            if (sortBy === 'vote_average.desc') {
              return film2.vote_average - film1.vote_average;
            }
            if (sortBy === 'recommended') {
              let score1 = score_movies.data.scoreMovies.find(
                (moviescore) => moviescore.movieId === film1.id
              );
              let score2 = score_movies.data.scoreMovies.find(
                (moviescore) => moviescore.movieId === film2.id
              );
              score1 = score1 ? score1.totalMovieScore : 0;
              score2 = score2 ? score2.totalMovieScore : 0;

              return score2 - score1;
            }

            return film1.popularity - film2.popularity;
          });

          setMovies(films);
        })
        .catch((error) => {
          // Do something if call failed
          console.log(error);
        });
    });
  };
  useEffect(
    () =>
      fetchMovies(
        search_name,
        page_requested,
        sortBy_requested,
        genre_requested
      ),
    [genre_requested, page_requested, search_name, sortBy_requested]
  );

  return { movies };
}
