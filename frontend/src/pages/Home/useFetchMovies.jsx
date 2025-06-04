import { useState, useEffect } from 'react';
import axios from 'axios';

export function useFetchMovies(searchTerm, page, type = 'movie') {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const baseUrl = searchTerm
      ? `https://api.themoviedb.org/3/search/${type}`
      : `https://api.themoviedb.org/3/${type}/popular`;

    axios
      .get(baseUrl, {
        params: {
          page,
          query: searchTerm || undefined,
        },
        headers: {
          accept: 'application/json',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo',
        },
      })
      .then((response) => {
        if (page === 1) {
          setItems(response.data.results);
        } else {
          setItems((prev) => [...prev, ...response.data.results]);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [searchTerm, page, type]);

  useEffect(() => {
    setItems([]); 
  }, [searchTerm, type]);

  return { items, loading, error };
}
