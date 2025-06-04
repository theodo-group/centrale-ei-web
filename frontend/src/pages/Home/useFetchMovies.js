import { useEffect, useState } from 'react';
import axios from 'axios';

export function useFetchMovies(sortOption = 'default') {
  const [movies, setMovies] = useState([]);
  const [moviesloading, setMoviesLoading] = useState(false);
  const [movieserrror, setMoviesError] = useState(null);

  // 🔥 CONFIGURATION : Nombre de pages à récupérer
  const MAX_PAGES = 100; // ← CHANGEZ CETTE VALEUR ICI
  // Exemples :
  // const MAX_PAGES = 50;   // = 1000 films
  // const MAX_PAGES = 200;  // = 4000 films
  // const MAX_PAGES = 500;  // = 10000 films

  // 🔥 NOUVEAUTÉ : Fonction pour convertir le tri en paramètres API
  const getSortParams = (option) => {
    // 🎬 DATE ACTUELLE pour filtrer les films sortis
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

    // 🎬 PARAMÈTRES COMMUNS : Seulement les films sortis
    const commonParams = {
      'release_date.lte': today, // Date de sortie <= aujourd'hui
      with_release_type: '2|3', // Type 2=Theatrical, Type 3=Theatrical Limited
    };

    switch (option) {
      case 'release_date':
        return {
          url: 'https://api.themoviedb.org/3/discover/movie',
          params: {
            sort_by: 'release_date.desc',
            ...commonParams,
          },
        };

      case 'vote_average':
        return {
          url: 'https://api.themoviedb.org/3/discover/movie',
          params: {
            sort_by: 'vote_average.desc',
            'vote_count.gte': 100, // Au moins 100 votes
            ...commonParams,
          },
        };

      case 'vote_count':
        return {
          url: 'https://api.themoviedb.org/3/discover/movie',
          params: {
            sort_by: 'vote_count.desc',
            ...commonParams,
          },
        };

      case 'revenue':
        return {
          url: 'https://api.themoviedb.org/3/discover/movie',
          params: {
            sort_by: 'revenue.desc',
            ...commonParams,
          },
        };

      case 'alphabetical':
        return {
          url: 'https://api.themoviedb.org/3/discover/movie',
          params: {
            sort_by: 'title.asc',
            ...commonParams,
          },
        };

      default: // 'default' = trending (déjà sortis par nature)
        return {
          url: 'https://api.themoviedb.org/3/trending/movie/day',
          params: {}, // Trending = automatiquement des films sortis
        };
    }
  };

  // 2. Configuration de base pour toutes les requêtes
  const baseHeaders = {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo',
  };

  // 3. Fonction pour récupérer tous les films avec tri global
  const fetchMovies = async () => {
    setMoviesError(null);
    setMoviesLoading(true);

    const allMovies = [];

    try {
      // 🔥 NOUVEAUTÉ : Récupérer les paramètres selon le tri choisi
      const { url, params: sortParams } = getSortParams(sortOption);

      console.log(`🌍 Démarrage du tri global: ${sortOption}`);
      console.log(`📡 URL utilisée: ${url}`);
      console.log(`⚙️ Paramètres: `, sortParams);

      // Boucle pour récupérer chaque page
      for (let pageNumber = 1; pageNumber <= MAX_PAGES; pageNumber++) {
        // 🔥 MODIFIÉ : Construction des options avec tri
        const optionsForThisPage = {
          method: 'GET',
          url: url,
          params: {
            language: 'en-US',
            page: pageNumber,
            ...sortParams, // 🔥 Ajout des paramètres de tri
          },
          headers: baseHeaders,
        };

        // Faire la requête HTTP pour cette page
        const response = await axios.request(optionsForThisPage);

        // Ajouter les films de cette page au tableau total
        const moviesFromThisPage = response.data.results;
        allMovies.push(...moviesFromThisPage);

        // Afficher le progrès dans la console
        console.log(
          `Page ${pageNumber}/${MAX_PAGES} récupérée (tri: ${sortOption})`
        );
        console.log(`- Films sur cette page: ${moviesFromThisPage.length}`);
        console.log(`- Total films récupérés: ${allMovies.length}`);

        // Petite pause pour ne pas surcharger l'API
        if (pageNumber < MAX_PAGES) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }

      // 🔥 TRI LOCAL UNIQUEMENT pour l'alphabétique (car API ne le supporte pas parfaitement)
      if (sortOption === 'alphabetical') {
        allMovies.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        console.log('🔤 Tri alphabétique local appliqué en plus');
      }

      setMovies(allMovies);
      console.log(
        `✅ Terminé! ${allMovies.length} films récupérés avec tri global: ${sortOption}`
      );
    } catch (err) {
      console.error('❌ Erreur:', err);
      setMoviesError(err.message);
    } finally {
      setMoviesLoading(false);
    }
  };

  // 4. Lancer la récupération au chargement et quand le tri change
  useEffect(() => {
    fetchMovies();
  }, [sortOption]); // 🔥 NOUVEAUTÉ : Se relance quand sortOption change

  // 5. Retourner les données
  return {
    movies,
    moviesloading,
    movieserrror,
    fetchMovies,
  };
}
