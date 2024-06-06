import typeorm from 'typeorm';

const Genre = new typeorm.EntitySchema({
  name: 'Genre',
  columns: {
    id: {
      primary: true,
      type: Number,
    },
    name: {
      type: String,
      unique: true, 
    },
  },
  relations: {
    movies: {
      type: 'many-to-many',
      target: 'Movie',
      inverseSide: 'genres',
      joinTable: true,
    },
  },
});

export default Genre;
