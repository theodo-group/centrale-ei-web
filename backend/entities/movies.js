import typeorm from 'typeorm';

const Movie = new typeorm.EntitySchema({
  name: 'Movie',
  columns: {
    id: {
      primary: true,
      type: Number,
      generated: true,
    },
    name: {
      type: String,
      unique: false,
    },
    release_date: { type: String },
  },
});

export default Movie;
