import { EntitySchema } from 'typeorm';

const User = new EntitySchema({
  name: 'User',
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
      cascade: true,
    },
  },
});

export default User;
