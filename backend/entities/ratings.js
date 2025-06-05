import typeorm from 'typeorm';

const Ratings = new typeorm.EntitySchema({
  name: 'Ratings',
  columns: {
    id: {
      primary: true,
      type: Number,
      generated: true,
    },
    user_id: {
      type: Number,
    },
    movie_id: {
      type: Number,
    },
    rating: {
      type: Number,
    },
    comment: {
      type: String,
      nullable: true,
    },
  },
});

export default Ratings;