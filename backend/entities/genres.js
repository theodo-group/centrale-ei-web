import { EntitySchema } from 'typeorm';

const Genre = new EntitySchema({
  name: 'Genre',
  tableName: 'Genre',
  columns: {
    id: { primary: true, type: Number },
    name: { type: String },
  },
  relations: {
    movies: {
      target: 'Movie',
      type: 'many-to-many',
      mappedBy: 'genres',
    },
  },
});

export default Genre;
