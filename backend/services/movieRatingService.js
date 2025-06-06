import axios from 'axios';

// Configuration de base
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// Service pour gérer les ratings des films
export class MovieRatingService {
  /**
   * Met à jour le rating d'un film
   * @param {number} movieId - ID du film
   * @param {number} rating - Rating (-1, 0, 1)
   * @returns {Promise<Object>} Réponse de l'API
   */
  static async updateMovieRating(movieId, rating) {
    try {
      console.log(`Updating movie ${movieId} rating to: ${rating}`);

      const response = await axios.patch(
        `${BACKEND_URL}/movies/${movieId}/rating`,
        { likedislike: rating },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        }
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error updating movie rating:', error);

      if (error.response) {
        // Erreur de réponse du serveur
        return {
          success: false,
          error: error.response.data.error || 'Server error',
          message: error.response.data.message || 'Failed to update rating',
          status: error.response.status,
        };
      } else if (error.request) {
        // Erreur de réseau
        return {
          success: false,
          error: 'Network error',
          message: 'Unable to connect to server',
        };
      } else {
        // Autre erreur
        return {
          success: false,
          error: 'Unknown error',
          message: error.message,
        };
      }
    }
  }

  /**
   * Like un film (rating = 1)
   * @param {number} movieId - ID du film
   * @returns {Promise<Object>} Réponse de l'API
   */
  static async likeMovie(movieId) {
    return this.updateMovieRating(movieId, 1);
  }

  /**
   * Dislike un film (rating = -1)
   * @param {number} movieId - ID du film
   * @returns {Promise<Object>} Réponse de l'API
   */
  static async dislikeMovie(movieId) {
    return this.updateMovieRating(movieId, -1);
  }

  /**
   * Retire le rating d'un film (rating = 0)
   * @param {number} movieId - ID du film
   * @returns {Promise<Object>} Réponse de l'API
   */
  static async neutralMovie(movieId) {
    return this.updateMovieRating(movieId, 0);
  }

  /**
   * Récupère le rating actuel d'un film
   * @param {number} movieId - ID du film
   * @returns {Promise<Object>} Rating du film
   */
  static async getMovieRating(movieId) {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/movies/${movieId}/rating`,
        { timeout: 10000 }
      );

      return {
        success: true,
        rating: response.data.data.likedislike || 0,
      };
    } catch (error) {
      console.error('Error fetching movie rating:', error);

      return {
        success: false,
        rating: 0,
        error: error.response?.data?.error || 'Failed to fetch rating',
      };
    }
  }

  /**
   * Récupère tous les films ratés par l'utilisateur
   * @returns {Promise<Object>} Liste des films likés/dislikés
   */
  static async getAllRatedMovies() {
    try {
      const response = await axios.get(`${BACKEND_URL}/movies/ratings/all`, {
        timeout: 15000,
      });

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error('Error fetching all rated movies:', error);

      return {
        success: false,
        data: { liked: [], disliked: [], total: { liked: 0, disliked: 0 } },
        error: error.response?.data?.error || 'Failed to fetch rated movies',
      };
    }
  }

  /**
   * Synchronise le localStorage avec la base de données
   * @param {number} movieId - ID du film
   * @returns {Promise<number>} Rating synchronisé (-1, 0, 1)
   */
  static async syncRatingFromDatabase(movieId) {
    const result = await this.getMovieRating(movieId);
    if (result.success) {
      return result.rating;
    }

    return 0; // Valeur par défaut en cas d'erreur
  }
}

export default MovieRatingService;
