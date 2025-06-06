const typeorm = require('typeorm');

const Rating = new typeorm.EntitySchema({
  name: 'Rating',
  tableName: 'ratings',
  columns: {
    id: {
      primary: true,
      type: Number,
      generated: true,
    },
    value: {
      type: 'float',
      nullable: false,
    },
  },
  relations: {
    user: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: true,
      eager: true,
    },
    movie: {
      type: 'many-to-one',
      target: 'Movie',
      joinColumn: true,
      eager: true,
    },
  },
  uniques: [
    {
      name: 'UNIQUE_USER_MOVIE',
      columns: ['user', 'movie'],
    },
  ],
});

module.exports = { Rating };
