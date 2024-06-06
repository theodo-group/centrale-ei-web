import typeorm from 'typeorm';

const Movie = new typeorm.EntitySchema({
  name: 'Movie',
  columns: {
    id: {
      primary: true,
      type: Number,
    },
    title: {
      type: String,
      unique: false,
    },
    release_date: { type: String },
    poster_path: {type : String},
    backdrop_path: {type: String},
    description: {type: String},
    popularity: {type: 'float'}
  },
  relations: {
    genres: {
      type: 'many-to-many',
      target: 'Genre',
      inverseSide: 'movies',
      joinTable: true,
      cascade: true,
    },
    ratings: {
      type: 'one-to-many',
      target: 'Rating',
      inverseSide: 'movie',
      cascade: true,
    },
  },
});

export default Movie;
