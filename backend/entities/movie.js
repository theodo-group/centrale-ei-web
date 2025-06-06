import typeorm from 'typeorm';

const Movie = new typeorm.EntitySchema({
  name: 'Movie',
  columns: {
    id: {
      primary: true,
      type: Number,
      generated: true,
    },
    title: {
      type: String,
      unique: true,
      nullable: false,
    },
    release_date: {
      type: String,
      nullable: true,
    },
    poster_path: {
      type: String,
      nullable: true,
    },
    overview: {
      type: String,
      nullable: true,
    },
    popularity: {
      type: Number,
      nullable: true,
    },
    vote_average: {
      type: Number,
      nullable: true,
    },
    vote_count: {
      type: Number,
      nullable: true,
    },
    media_type: {
      type: String,
      nullable: true,
    },
    // Id pour l'API TMDB
    tmdb_id: {
      type: Number,
      nullable: true,
      unique: true,
    },
    original_language: {
      type: String,
      nullable: true,
    },
    original_title: {
      type: String,
      nullable: true,
    },
    genre_ids: {
      type: 'simple-array',
      nullable: true,
      transformer: {
        to: (value) => {
          // Convertit le tableau JS vers une chaîne pour la DB
          return value && Array.isArray(value) ? value.join(',') : null;
        },
        from: (value) => {
          // Convertit la chaîne DB vers un tableau d'entiers
          console.log('Converting genre_ids from DB:', value);

          return value;
        },
      },
    },
    backdrop_path: {
      type: String,
      nullable: true,
    },
    adult: {
      type: Boolean,
      nullable: true,
      default: false,
    },
    video: {
      type: Boolean,
      nullable: true,
      default: false,
    },
    // Colonne pour gérer les likes/dislikes
    // -1 = dislike, 0 = neutre/pas d'avis, 1 = like
    likedislike: {
      type: Number,
      nullable: true,
      default: 0,
      transformer: {
        to: (value) => {
          // Validation lors de l'écriture en base
          if (value === null || value === undefined) {
            return 0;
          }
          const numValue = Number(value);
          if (numValue === -1 || numValue === 0 || numValue === 1) {
            return numValue;
          }
          // Si la valeur n'est pas valide, on met 0 par défaut
          console.warn(`Invalid likedislike value: ${value}, setting to 0`);

          return 0;
        },
        from: (value) => {
          // Validation lors de la lecture depuis la base
          const numValue = Number(value);
          if (numValue === -1 || numValue === 0 || numValue === 1) {
            return numValue;
          }
          // Si la valeur en base n'est pas valide, on retourne 0
          console.warn(
            `Invalid likedislike value from DB: ${value}, returning 0`
          );

          return 0;
        },
      },
    },
  },
});

export default Movie;
