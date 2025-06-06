import { useEffect, useRef, useState, useContext } from 'react';
import axios from 'axios';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import Movie from '../../components/Movie/Movie';
import UserContext from '../../UserContext';

const PAGES_TO_FETCH = 5;

function Home() {
  const { selectedUserId } = useContext(UserContext);

  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState([]);
  const [sortOption, setSortOption] = useState('popularity');
  const [sortDirection, setSortDirection] = useState('desc');
  const [loading, setLoading] = useState(false);

  const [genresList, setGenresList] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [includeAdult, setIncludeAdult] = useState(false);
  const [selecPerso, setSelecPerso] = useState(false);

  const debounceTimeout = useRef(null);
  const navigate = useNavigate();

  const [showGenres, setShowGenres] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);

  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const apiKey = import.meta.env.VITE_TMDB_API_KEY;
        const baseUrl = import.meta.env.VITE_TMDB_BASE_URL;
        const response = await axios.get(`${baseUrl}/genre/movie/list`, {
          headers: { Authorization: `Bearer ${apiKey}` },
          params: { language: 'fr-FR' },
        });
        setGenresList(response.data.genres);
      } catch (error) {
        console.error('Erreur lors du chargement des genres:', error);
      }
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    if (!selectedUserId) {
      setRecommendations([]);
      return;
    }

    const fetchRecommendations = async () => {
      setLoadingRecommendations(true);
      try {
        const response = await axios.get(`/api/recommendations/${selectedUserId}`);
        setRecommendations(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des recommandations:', error);
        setRecommendations([]);
      } finally {
        setLoadingRecommendations(false);
      }
    };
    fetchRecommendations();
  }, [selectedUserId]);

  const handleMovieClick = async (movieId) => {
    try {
      await axios.get(`/api/movies/${movieId}`);
      navigate(`/details/${movieId}`);
    } catch (error) {
      console.error('Erreur lors de la vérification/ajout du film:', error);
    }
  };

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const apiKey = import.meta.env.VITE_TMDB_API_KEY;
      const baseUrl = import.meta.env.VITE_TMDB_BASE_URL;

      if (searchTerm.trim().length > 0) {
        const response = await axios.get(`${baseUrl}/search/movie`, {
          headers: { Authorization: `Bearer ${apiKey}` },
          params: {
            query: searchTerm,
            include_adult: includeAdult,
            language: 'fr-FR',
            page: 1,
          },
        });
        setMovies(response.data.results.slice(0, 100));
      } else {
        const genreParam =
          selectedGenres.length > 0 ? selectedGenres.join(',') : undefined;

        const promises = Array.from({ length: PAGES_TO_FETCH }, (_, i) =>
          axios.get(`${baseUrl}/discover/movie`, {
            headers: { Authorization: `Bearer ${apiKey}` },
            params: {
              language: 'fr-FR',
              sort_by: sortOption + '.' + sortDirection,
              with_genres: genreParam,
              include_adult: includeAdult,
              page: i + 1,
            },
          })
        );

        const responses = await Promise.all(promises);
        const allMovies = responses.flatMap((r) => r.data.results);
        setMovies(allMovies.slice(0, 100));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des films :', error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(fetchMovies, 500);
    return () => clearTimeout(debounceTimeout.current);
  }, [searchTerm, sortOption, sortDirection, selectedGenres, includeAdult]);

  const toggleGenre = (id) => {
    setSelectedGenres((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const showMoreMovies = () => setVisibleCount((prev) => prev + 12);

  return (
    <>
      <h2>Home</h2>

      <div className="filters">
        <input
          placeholder="Rechercher un film..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={loading}
        />
        <button onClick={() => setShowGenres((v) => !v)}>
          {showGenres ? 'Masquer les genres' : 'Afficher les genres'}
        </button>
        {showGenres && (
          <div className="genres">
            {genresList.map((g) => (
              <label key={g.id}>
                <input
                  type="checkbox"
                  checked={selectedGenres.includes(g.id)}
                  onChange={() => toggleGenre(g.id)}
                />
                {g.name}
              </label>
            ))}
          </div>
        )}

        <label>
          <input
            type="checkbox"
            checked={includeAdult}
            onChange={() => setIncludeAdult((v) => !v)}
          />{' '}
          Inclure films pour adultes
        </label>

        <label>
          <input
            type="checkbox"
            checked={selecPerso}
            onChange={() => setSelecPerso((v) => !v)}
          />{' '}
          Utiliser recommandation personnalisée
        </label>

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          disabled={loading}
        >
          <option value="popularity">Popularité</option>
          <option value="release_date">Date de sortie</option>
          <option value="vote_average">Note moyenne</option>
          <option value="title">Titre (alphabétique)</option>
        </select>

        <select
          value={sortDirection}
          onChange={(e) => setSortDirection(e.target.value)}
          disabled={loading}
        >
          <option value="desc">Descendant</option>
          <option value="asc">Ascendant</option>
        </select>
      </div>

      <section className="movie-list">
        {loading && <div>Chargement des films...</div>}

        {!loading && selecPerso && (
          <>
            <h3>Recommandations pour l’utilisateur #{selectedUserId}</h3>
            {loadingRecommendations && <p>Chargement des recommandations...</p>}
            {!loadingRecommendations && recommendations.length === 0 && (
              <p>Aucune recommandation disponible.</p>
            )}
            <Movie
              movies={recommendations}
            />
          </>
        )}

        {!loading && !selecPerso && movies.length === 0 && <p>Aucun film trouvé.</p>}

        {!loading && !selecPerso && (
          <>
            <Movie
              movies={movies.slice(0, visibleCount)}
            />

            {visibleCount < movies.length && (
              <button onClick={showMoreMovies}>Voir plus</button>
            )}
          </>
        )}
      </section>
    </>
  );
}

export default Home;
