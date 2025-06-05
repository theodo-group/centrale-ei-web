import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import Movie from '../../components/Movie/Movie';

const PAGES_TO_FETCH = 5;

function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState([]);
  const [sortOption, setSortOption] = useState('popularity');
  const [sortDirection, setSortDirection] = useState('desc');
  const [loading, setLoading] = useState(false);

  const [genresList, setGenresList] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [includeAdult, setIncludeAdult] = useState(false);
  const [selecPerso, setSelecPerso] = useState(false)

  const debounceTimeout = useRef(null);
  const navigate = useNavigate();

  const [showGenres, setShowGenres] = useState(false);

  const [visibleCount, setVisibleCount] = useState(12);

  // Récupération des genres au montage
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

  // Fonction appelée au clic sur un film
  const handleMovieClick = async (movieId) => {
    try {
      await axios.get(`/api/movies/${movieId}`); // adapte le chemin si besoin
      navigate(`/details/${movieId}`);
    } catch (error) {
      console.error('Erreur lors de la vérification/ajout du film:', error);
    }
  };

  // Fonction pour chercher des films (search ou discover selon searchTerm)
  const fetchMovies = async () => {
    setLoading(true);
    try {
      const apiKey = import.meta.env.VITE_TMDB_API_KEY;
      const baseUrl = import.meta.env.VITE_TMDB_BASE_URL;

      if (searchTerm.trim().length > 0) {
        // Recherche par titre (search/movie)
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
        // Découverte avec filtres
        const genreParam =
          selectedGenres.length > 0 ? selectedGenres.join(',') : undefined;

        const promises = Array.from({ length: PAGES_TO_FETCH }, (_, i) =>
          axios.get(`${baseUrl}/discover/movie`, {
            headers: { Authorization: `Bearer ${apiKey}` },
            params: {
              language: 'fr-FR',
              sort_by: `${sortOption}.${sortDirection}`,
              page: i + 1,
              with_genres: genreParam,
              include_adult: includeAdult,
            },
          })
        );

        const results = await Promise.all(promises);
        const combinedMovies = results
          .flatMap((res) => res.data.results)
          .slice(0, 50);
        setMovies(combinedMovies);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des films:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      const background = document.querySelector('.background-blur');
      if (background) {
        background.style.transform = `translateY(${offset * 0.4}px)`; // parallax doux
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Déclenche la recherche avec un debounce pour éviter les appels trop fréquents
  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      fetchMovies();
    }, 500); // délai de 500ms après la dernière frappe

    return () => clearTimeout(debounceTimeout.current);
  }, [searchTerm, sortOption, sortDirection, selectedGenres, includeAdult]);

  const handleGenreChange = (genreId) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
  };

  const visibleMovies = movies.slice(0, visibleCount);

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
          />

          <div className="genre-dropdown">
            <button
              className="genre-toggle"
              onClick={() => setShowGenres((prev) => !prev)}
            >
              🎬 Genres
            </button>

            {showGenres && (
              <div className="genre-menu">
                {genresList.map((genre) => (
                  <label key={genre.id}>
                    <input
                      type="checkbox"
                      checked={selectedGenres.includes(genre.id)}
                      onChange={() => handleGenreChange(genre.id)}
                    />
                    {genre.name}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="filters">
        <div>
          <label htmlFor="sort">Trier par :</label>
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
        </div>

        <div>
          <label htmlFor="direction">Ordre :</label>
          <select
            id="direction"
            value={sortDirection}
            onChange={(e) => setSortDirection(e.target.value)}
          >
            <option value="desc">Décroissant</option>
            <option value="asc">Croissant</option>
          </select>
        </div>

        <label>
          <input
            type="checkbox"
            checked={includeAdult}
            onChange={() => setIncludeAdult(!includeAdult)}
          />
          Inclure les films adultes
        </label>
        <label>
          <input
            type ="checkbox"
            checked={selecPerso}
            onChange={() => setSelecPerso(!selecPerso)}
          />
          Sélection personalisée
        </label>
      </div>

      <h2>
        {searchTerm.trim()
          ? `Résultats de la recherche pour "${searchTerm}"`
          : 'Films'}
      </h2>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="Movie-grid">
          <Movie movies={visibleMovies} onMovieClick={handleMovieClick} />
          {visibleCount < movies.length && (
            <div className="load-more-container">
              <button className="load-more-btn" onClick={() => setVisibleCount(visibleCount + 12)}>
                Afficher plus
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
