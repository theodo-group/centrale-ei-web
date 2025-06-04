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
    // AJOUTÉ : Titre original du film
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
          return value ? value.split(',').map((id) => parseInt(id, 10)) : [];
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
    // AJOUTÉ : Indique si c'est une vidéo (trailer, etc.)
    video: {
      type: Boolean,
      nullable: true,
      default: false,
    },
  },
});

export default Movie;
