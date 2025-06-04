import typeorm from 'typeorm';

const User = new typeorm.EntitySchema({
  name: 'Movie',
  columns: {
    id: {
        primary : true,
        type: Number
    },
    title: {
      type: String
    },
    year: {
      type: String
    },
  },
});

export default User;

