import { EntitySchema } from 'typeorm';

const Rating = new EntitySchema({
  name: 'Rating',
  columns: {
    id: {
        primary: true,
        type: Number,
        generated: true,
    },
    value: { type: Number },
  },
  relations: {
    user: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: true,
    },
    movie: {
      type: 'many-to-one',
      target: 'Movie',
      joinColumn: true,
    },
  },
});

export default Rating;
