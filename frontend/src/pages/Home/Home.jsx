import { useEffect, useState } from 'react';
import axios from 'axios';
import './Home.css';
import Movie from '../../components/Movie/Movie';

const PAGES_TO_FETCH = 5;

const DEFAULT_FORM_VALUES = { name: '' };

function Home() {
  const [movieName, setMovieName] = useState(DEFAULT_FORM_VALUES);
  const [movies, setMovies] = useState([]);
  const [sortOption, setSortOption] = useState('popularity');
  const [sortDirection, setSortDirection] = useState('desc');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const apiKey = import.meta.env.VITE_TMDB_API_KEY;
        const baseUrl = import.meta.env.VITE_TMDB_BASE_URL;

        const promises = Array.from({ length: PAGES_TO_FETCH }, (_, i) =>
          axios.get(`${baseUrl}/discover/movie`, {
            params: {
              language: 'fr-FR',
              sort_by: `${sortOption}.${sortDirection}`,
              page: i + 1,
            },
            headers: {
              accept: 'application/json',
              Authorization: `Bearer ${apiKey}`,
            },
          })
        );

        const results = await Promise.all(promises);
        const combinedMovies = results.flatMap((res) => res.data.results).slice(0, 50);
        setMovies(combinedMovies);
      } catch (error) {
        console.error('Erreur lors de la récupération des films:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [sortOption, sortDirection]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Popcorn Advisor</h1>
      </header>

      <div>
        <input
          type="text"
          value={movieName.name}
          onChange={(event) =>
            setMovieName({ ...movieName, name: event.target.value })
          }
          placeholder="Rechercher un film..."
        />
      </div>

      <div>
        <label htmlFor="sort">Trier par : </label>
        <select
          id="sort"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="popularity">Popularité</option>
          <option value="release_date">Date de sortie</option>
          <option value="title">Titre (Alphabétique)</option>
          <option value="vote_average">Note moyenne</option>
        </select>
        <label htmlFor="direction">Direction : </label>
        <select
          id="direction"
          value={sortDirection}
          onChange={(e) => setSortDirection(e.target.value)}
        >
          <option value="desc">Décroissant</option>
          <option value="asc">Croissant</option>
        </select>
      </div>

      <h2>Films</h2>
      {loading ? <p>Chargement...</p> : <Movie movies={movies} />}
    </div>
  );
}

export default Home;
