const typeorm = require('typeorm');

const User = new typeorm.EntitySchema({
  name: 'User',
  tableName: 'User',
  columns: {
    id: {
      primary: true,
      type: Number,
      generated: true,
    },
    email: {
      type: String,
      unique: true,
    },
    firstname: { type: String },
    lastname: { type: String },
  },
  relations: {
    ratings: {
      type: 'one-to-many',
      target: 'Rating',
      inverseSide: 'user',
      cascade: true, // utile pour supprimer automatiquement les ratings en supprimant un user
    },
  },
});

module.exports = { User };
