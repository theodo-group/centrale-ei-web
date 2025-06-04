import typeorm from 'typeorm';

const Movie = new typeorm.EntitySchema({
  name: 'Movie',
  tableName: 'Movie',
  columns: {
    id: {
      primary: true,
      type: Number,
    },
    title: { type: String },
    originalTitle: {
      name: 'original_title',
      type: String,
      nullable: true,
    },
    overview: { type: 'text', nullable: true },
    releaseDate: {
      name: 'release_date',
      type: Date,
      nullable: true,
    },
    posterPath: {
      name: 'poster_path',
      type: String,
      nullable: true,
    },
    backdropPath: {
      name: 'backdrop_path',
      type: String,
      nullable: true,
    },
    voteAverage: {
      name: 'vote_average',
      type: 'float',
      nullable: true,
    },
    voteCount: {
      name: 'vote_count',
      type: 'int',
      nullable: true,
    },
    popularity: {
      type: 'float',
      nullable: true,
    },
    originalLanguage: {
      name: 'original_language',
      type: String,
      nullable: true,
    },
  },
  uniques: [
    { name: 'UQ_title_releaseDate', columns: ['title', 'releaseDate'] },
  ],
  relations: {
    genres: {
      target: 'Genre',
      type: 'many-to-many',
      eager: true,
      cascade: true,
      joinTable: {
        name: 'Movies_genres',         // Nom personnalisé de la table de jointure
        joinColumn: {
          name: 'MovieId',
          referencedColumnName: 'id',
        },
        inverseJoinColumn: {
          name: 'GenreId',
          referencedColumnName: 'id',
        },
      },
    },
  },
});

export default Movie;
