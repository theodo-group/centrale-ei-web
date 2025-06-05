import { useState, useEffect } from 'react';
import axios from 'axios';

export function useFetchMovies(searchTerm, page, type = 'movie',genre='') {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    axios
      .get('http://localhost:8000/movies', {
        params: {
          search: searchTerm,
          page,
          type,
          genre_id:genre,
        },
      })
      .then((response) => {
        setItems(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [searchTerm, page, type, genre]);

  return { items, loading, error };
}