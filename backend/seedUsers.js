import { appDataSource } from './datasource.js';
import User from './entities/user.js';

appDataSource.initialize().then(async () => {
  const usersRepo = appDataSource.getRepository(User);
  await usersRepo.save([
    { email: 'alice@example.com', firstname: 'Alice', lastname: 'A.' },
    { email: 'bob@example.com', firstname: 'Bob', lastname: 'B.' },
    { email: 'carol@example.com', firstname: 'Carol', lastname: 'C.' }
  ]);
  console.log('Utilisateurs créés !');
  process.exit(0);
});