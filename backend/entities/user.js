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
});

module.exports = User;
