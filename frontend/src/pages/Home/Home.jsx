import { useEffect, useState } from 'react';
import './Home.css';
import { useFetchMovies } from './useFetchMovies';
import Movie from '../../components/Movie/Movie.jsx';

function Home() {
  const [movieName, setMovieName] = useState('');
  const [sortOption, setSortOption] = useState('default');

  // 🔥 NOUVEAUTÉ : Hook modifié qui accepte les paramètres de tri
  const { movies, moviesloading, movieserrror, fetchMovies } =
    useFetchMovies(sortOption);

  // Fonction pour filtrer les films par nom (garde le filtre local)
  const filterMovies = (moviesList, searchTerm) => {
    if (!searchTerm.trim()) {
      return moviesList;
    }

    return moviesList.filter((movie) =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // 🔥 SUPPRIMÉ : Plus besoin de tri local, c'est fait par l'API
  // const sortMovies = (moviesList, option) => { ... }

  // 🔥 MODIFIÉ : Seulement le filtre, pas le tri
  const filteredMovies = filterMovies(movies, movieName);

  // 🔥 NOUVEAUTÉ : Relancer la requête quand le tri change
  useEffect(() => {
    fetchMovies();
  }, [sortOption]); // Se déclenche quand sortOption change

  // Gestion des états de loading et d'erreur
  if (moviesloading) {
    return (
      <div className="App">
        <div className="loading-container">
          <h2>🎬 Chargement des films sortis...</h2>
          <p>Récupération de 100 pages depuis TheMovieDB</p>
          <p>Filtre : Seulement les films déjà sortis en salles 🎭</p>
          <p>Tri global : {getSortLabel(sortOption) || 'par défaut'}</p>
          <p>Cela peut prendre 15-20 secondes</p>
        </div>
      </div>
    );
  }

  if (movieserrror) {
    return (
      <div className="App">
        <div className="error-container">
          <h2>❌ Erreur</h2>
          <p>{movieserrror}</p>
          <button onClick={fetchMovies}>Réessayer</button>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎬 Films Sortis (Tri Global)</h1>

        {/* Section de recherche et filtres */}
        <div className="controls-section">
          <input
            type="text"
            placeholder="Rechercher un film..."
            value={movieName}
            onChange={(event) => setMovieName(event.target.value)}
            className="search-input"
          />

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="sort-select"
          >
            <option value="default">🔥 Popularité (Tendance)</option>
            <option value="release_date">
              📅 Date de sortie ↓ (Plus récent)
            </option>
            <option value="vote_average">⭐ Note ↓ (Meilleure d'abord)</option>
            <option value="vote_count">👥 Nombre de votes ↓</option>
            <option value="revenue">💰 Revenus ↓</option>
            <option value="alphabetical">🔤 A → Z (Alphabétique)</option>
          </select>
        </div>

        {/* Affichage de la recherche active */}
        {movieName && <p>🔍 Recherche locale : "{movieName}"</p>}

        {/* 🔥 NOUVEAUTÉ : Indication du tri global */}
        {sortOption !== 'default' && (
          <p>🌍 Tri global appliqué : {getSortLabel(sortOption)}</p>
        )}

        {/* Compteur de films */}
        <p>
          📊 {filteredMovies.length} film{filteredMovies.length > 1 ? 's' : ''}{' '}
          affiché{filteredMovies.length > 1 ? 's' : ''}
          {movieName &&
            ` (filtré${filteredMovies.length > 1 ? 's' : ''} localement)`}
        </p>

        {/* Affichage du total de films récupérés */}
        <p>🎯 Total de films récupérés : {movies.length} / 20000 disponibles</p>
      </header>

      <div className="movies-list">
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => <Movie key={movie.id} movie={movie} />)
        ) : (
          <div className="no-results">
            <p>😞 Aucun film trouvé pour "{movieName}"</p>
            <p>Essayez un autre terme de recherche</p>
          </div>
        )}
      </div>
    </div>
  );
}

// 🔥 MODIFIÉ : Labels pour les nouveaux tris globaux
function getSortLabel(option) {
  const labels = {
    default: 'popularité (tendance)',
    release_date: 'date de sortie décroissante',
    vote_average: 'note décroissante',
    vote_count: 'nombre de votes décroissant',
    revenue: 'revenus décroissants',
    alphabetical: 'ordre alphabétique',
  };

  return labels[option];
}

export default Home;
