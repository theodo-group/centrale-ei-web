import { useState } from 'react';
import './Home.css';
import { useFetchMovies } from './useFetchMovies';
import Movie from '../../components/Movie/Movie.jsx';

function Home() {
  const [movieName, setMovieName] = useState('');
  const [sortOption, setSortOption] = useState('default'); // Nouvel état pour le tri
  const { movies, moviesLoadingError, fetchMovies } = useFetchMovies();

  // Fonction pour trier les films
  const sortMovies = (Movies, option) => {
    const moviesCopy = [...Movies]; // Copie pour ne pas modifier l'original

    switch (option) {
      case 'alphabetical':
        return moviesCopy.sort((a, b) =>
          (a.title || '').localeCompare(b.title || '')
        );

      case 'reverse_alphabetical':
        return moviesCopy.sort((a, b) =>
          (b.title || '').localeCompare(a.title || '')
        );

      case 'rating-high':
        return moviesCopy.sort(
          (a, b) => (b.vote_average || 0) - (a.vote_average || 0)
        );

      case 'rating-low':
        return moviesCopy.sort(
          (a, b) => (a.vote_average || 0) - (b.vote_average || 0)
        );

      case 'release-date':
        return moviesCopy.sort(
          (a, b) =>
            new Date(b.release_date || 0) - new Date(a.release_date || 0)
        );

      default:
        return moviesCopy; // Ordre original
    }
  };

  // Films triés selon l'option sélectionnée
  const sortedMovies = sortMovies(movies, sortOption);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Liste Films</h1>

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
            <option value="default">Tri par défaut</option>
            <option value="alphabetical">A → Z (Alphabétique)</option>
            <option value="reverse-alphabetical">
              Z → A (Inverse alphabétique)
            </option>
            <option value="rating-high">Note ↓ (Meilleure d'abord)</option>
            <option value="rating-low">Note ↑ (Moins bonne d'abord)</option>
            <option value="release-date">Date de sortie ↓ (Plus récent)</option>
          </select>
        </div>

        {movieName && <p>Recherche : "{movieName}"</p>}

        <p>
          {sortedMovies.length} film{sortedMovies.length > 1 ? 's' : ''} trouvé
          {sortedMovies.length > 1 ? 's' : ''}
          {sortOption !== 'default' &&
            ` (triés par ${getSortLabel(sortOption)})`}
        </p>
      </header>

      <div className="movies-list">
        {sortedMovies.map((movie) => (
          <Movie key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

// Fonction utilitaire pour afficher le label du tri
function getSortLabel(option) {
  const labels = {
    reverse_alphabetical: 'ordre alphabétique inverse',
    alphabetical: 'ordre alphabétique',
    rating_high: 'note décroissante',
    rating_low: 'note croissante',
    release_date: 'date de sortie',
  };

  return labels[option] || '';
}

export default Home;
