import typeorm from 'typeorm';

const Genre = new typeorm.EntitySchema({
  name: 'Genre',
  columns: {
    tmdb_id: {
      primary: true,
      type: Number,
    },
    name: {
      type: String,
      unique: true,
      nullable: false,
    },
  },
});

export default Genre;
