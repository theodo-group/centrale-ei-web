import typeorm from 'typeorm';

const Score = new typeorm.EntitySchema({
  name: 'Score',
  columns: {
    id: {
      primary: true,
      type: Number,
      generated: true,
    },
    score: {
      type: Number,
    },
  },
  relations: {
    movies: {
      target: 'Movie',
      type: 'many-to-one',
      inverseSide: 'score.id',
    },
    users: {
      target: 'User',
      type: 'many-to-one',
      inverseSide: 'score.id',
    },
  },
});

export default Score;
