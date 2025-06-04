import { useState, useEffect } from 'react';
import axios from 'axios';

export function useFetchMovies(searchTerm, page, type = 'movie') {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Appel à ton backend (ex: http://localhost:8000/movies)
    axios
      .get('http://localhost:8000/movies', {
        params: {
          search: searchTerm,
          page,
          type,
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
  }, [searchTerm, page, type]);

  return { items, loading, error };
}