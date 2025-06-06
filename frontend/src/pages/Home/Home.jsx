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

  // Récupérer les genres à l'initialisation
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

  // Charger les recommandations utilisateur quand selectedUserId change
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

  // Gestion du clic sur un film (vérification/ajout puis navigation)
  const handleMovieClick = async (movieId) => {
    try {
      await axios.get(`/api/movies/${movieId}`);
      navigate(`/details/${movieId}`);
    } catch (error) {
      console.error('Erreur lors de la vérification/ajout du film:', error);
    }
  };

  // Fonction fetch des films (recherche, filtres, pagination)
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
        const genreParam = selectedGenres.length > 0 ? selectedGenres.join(',') : undefined;

        const promises = Array.from({ length: PAGES_TO_FETCH }, (_, i) =>
          axios.get(`${baseUrl}/discover/movie`, {
            headers: { Authorization: `Bearer ${apiKey}` },
            params: {
              language: 'fr-FR',
              sort_by: `${sortOption}.${sortDirection}`,
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

  // Debounce de la recherche / filtres
  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(fetchMovies, 500);
    return () => clearTimeout(debounceTimeout.current);
  }, [searchTerm, sortOption, sortDirection, selectedGenres, includeAdult]);

  // Gestion sélection/désélection d’un genre
  const toggleGenre = (id) => {
    setSelectedGenres((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  // Afficher plus de films (pagination simple côté client)
  const showMoreMovies = () => setVisibleCount((prev) => prev + 12);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Bienvenue, que souhaitez-vous regarder ?</h1>
      </header>

      <section className="search-section">
        <div className="search-bar-container">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un film..."
            disabled={loading}
          />
          <div className="genre-dropdown">
            <button
              className="genre-toggle"
              onClick={() => setShowGenres((v) => !v)}
            >
              {showGenres ? 'Masquer les genres' : 'Afficher les genres'}
            </button>
            {showGenres && (
              <div className="genre-menu">
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
          </div>
        </div>
      </section>

      <div className="filters">
        <label>
          <input
            type="checkbox"
            checked={includeAdult}
            onChange={() => setIncludeAdult((v) => !v)}
          />
          Inclure films pour adultes
        </label>

        <label>
          <input
            type="checkbox"
            checked={selecPerso}
            onChange={() => setSelecPerso((v) => !v)}
          />
          Utiliser recommandation personnalisée
        </label>

        <div>
          <label htmlFor="sort">Trier par :</label>
          <select
            id="sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            disabled={loading}
          >
            <option value="popularity">Popularité</option>
            <option value="release_date">Date de sortie</option>
            <option value="vote_average">Note moyenne</option>
            <option value="title">Titre (alphabétique)</option>
          </select>
        </div>

        <div>
          <label htmlFor="direction">Ordre :</label>
          <select
            id="direction"
            value={sortDirection}
            onChange={(e) => setSortDirection(e.target.value)}
            disabled={loading}
          >
            <option value="desc">Descendant</option>
            <option value="asc">Ascendant</option>
          </select>
        </div>
      </div>

      <h2>
        {searchTerm.trim()
          ? `Résultats de la recherche pour "${searchTerm}"`
          : 'Films'}
      </h2>

      {loading && <p>Chargement des films...</p>}

      {!loading && selecPerso && (
        <>
          <h3>Recommandations pour l’utilisateur #{selectedUserId}</h3>
          {loadingRecommendations && <p>Chargement des recommandations...</p>}
          {!loadingRecommendations && recommendations.length === 0 && (
            <p>Aucune recommandation disponible.</p>
          )}
          <div className="Movie-grid">
            <Movie movies={recommendations} onMovieClick={handleMovieClick} />
          </div>
        </>
      )}

      {!loading && !selecPerso && movies.length === 0 && <p>Aucun film trouvé.</p>}

      {!loading && !selecPerso && (
        <div className="Movie-grid">
          <Movie movies={movies.slice(0, visibleCount)} onMovieClick={handleMovieClick} />
          {visibleCount < movies.length && (
            <div className="load-more-container">
              <button
                className="load-more-btn"
                onClick={() => setVisibleCount(visibleCount + 12)}
              >
                Voir plus
              </button>
            </div>
          )}
        </div>
      )}
    </div>


  );
}


export default Home;
