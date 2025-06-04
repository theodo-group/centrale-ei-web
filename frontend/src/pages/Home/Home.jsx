import { useEffect, useState } from 'react';
import axios from 'axios';
import './Home.css';
import Movie from '../../components/Movie/Movie';

const PAGES_TO_FETCH = 5;

function Home() {
  const [movieName, setMovieName] = useState('');
  const [movies, setMovies] = useState([]);
  const [sortOption, setSortOption] = useState('popularity');
  const [sortDirection, setSortDirection] = useState('desc');
  const [loading, setLoading] = useState(false);

  const [genresList, setGenresList] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [includeAdult, setIncludeAdult] = useState(false);

  // Récupération de la liste des genres au montage
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const apiKey = import.meta.env.VITE_TMDB_API_KEY;
        const baseUrl = import.meta.env.VITE_TMDB_BASE_URL;
        const response = await axios.get(`${baseUrl}/genre/movie/list`, {
          headers: { Authorization: `Bearer ${apiKey}` },
          params: { language: 'fr-FR' }, // langue fixe à français
        });
        setGenresList(response.data.genres);
      } catch (error) {
        console.error('Erreur lors du chargement des genres:', error);
      }
    };
    fetchGenres();
  }, []);

  // Chargement des films quand filtres changent
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const apiKey = import.meta.env.VITE_TMDB_API_KEY;
        const baseUrl = import.meta.env.VITE_TMDB_BASE_URL;

        const genreParam = selectedGenres.length > 0 ? selectedGenres.join(',') : undefined;

        const promises = Array.from({ length: PAGES_TO_FETCH }, (_, i) =>
          axios.get(`${baseUrl}/discover/movie`, {
            headers: {
              accept: 'application/json',
              Authorization: `Bearer ${apiKey}`,
            },
            params: {
              language: 'fr-FR', // langue fixe
              sort_by: `${sortOption}.${sortDirection}`,
              page: i + 1,
              with_genres: genreParam,
              include_adult: includeAdult,
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
  }, [sortOption, sortDirection, selectedGenres, includeAdult, movieName]);

  // Gestion de la sélection/désélection des genres
  const handleGenreChange = (genreId) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Popcorn Advisor</h1>
      </header>

      <div>
        <input
          type="text"
          value={movieName}
          onChange={(e) => setMovieName(e.target.value)}
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
          <option value="title">Titre (alphabétique)</option>
          <option value="vote_average">Note moyenne</option>
        </select>

        <label htmlFor="direction">Ordre : </label>
        <select
          id="direction"
          value={sortDirection}
          onChange={(e) => setSortDirection(e.target.value)}
        >
          <option value="desc">Décroissant</option>
          <option value="asc">Croissant</option>
        </select>
      </div>

      <div>
        <fieldset>
          <legend>Genres :</legend>
          {genresList.map((genre) => (
            <label key={genre.id} style={{ marginRight: '10px' }}>
              <input
                type="checkbox"
                checked={selectedGenres.includes(genre.id)}
                onChange={() => handleGenreChange(genre.id)}
              />
              {genre.name}
            </label>
          ))}
        </fieldset>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={includeAdult}
            onChange={() => setIncludeAdult(!includeAdult)}
          />
          Inclure les films adultes
        </label>
      </div>

      <h2>Films</h2>
      {loading ? <p>Chargement...</p> : <Movie movies={movies} />}
    </div>
  );
}

export default Home;
