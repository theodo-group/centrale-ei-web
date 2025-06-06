const { appDataSource } = require('../datasource');
const { User } = require('../entities/user');
const { Movie } = require('../entities/movies');
const { Rating } = require('../entities/ratings');

async function main() {
  await appDataSource.initialize();
  console.log('📦 Base de données connectée.');

  const userRepo = appDataSource.getRepository(User);
  const movieRepo = appDataSource.getRepository(Movie);
  const ratingRepo = appDataSource.getRepository(Rating);

  // ID fixe pour le user test
  const fixedUserId = 9999;

  // Supprimer l'utilisateur test s'il existe déjà (et ses notes)
  const existingUser = await userRepo.findOne({ where: { id: fixedUserId }, relations: ['ratings'] });
  if (existingUser) {
    await ratingRepo.delete({ user: { id: fixedUserId } });
    await userRepo.delete(fixedUserId);
    console.log(`🗑️ Ancien utilisateur test (ID: ${fixedUserId}) supprimé avec ses notes.`);
  }

  // Créer le nouvel utilisateur avec ID fixe
  const user = userRepo.create({
    id: fixedUserId,
    email: 'testuser@example.com',
    firstname: 'Test',
    lastname: 'User',
  });
  await userRepo.save(user);
  console.log(`👤 Nouvel utilisateur créé : ${user.firstname} ${user.lastname} (ID: ${user.id})`);

  // Récupérer tous les films
  const allMovies = await movieRepo.find();
  if (allMovies.length === 0) {
    console.log('❌ Aucun film trouvé. Exécute d’abord le seed TMDB.');
    return;
  }

  // Sélectionner aléatoirement la moitié des films
  const half = Math.floor(allMovies.length / 2);
  const shuffled = allMovies.sort(() => 0.5 - Math.random());
  const selectedMovies = shuffled.slice(0, half);

  for (const movie of selectedMovies) {
    const ratingValue = Math.round((Math.random() * 4 + 1) * 2) / 2; // entre 1.0 et 5.0 par pas de 0.5

    const rating = ratingRepo.create({
      user,
      movie,
      value: ratingValue,
    });
    await ratingRepo.save(rating);
    console.log(`✅ Note ajoutée : "${movie.title}" - ${ratingValue}/5`);
  }

  console.log(`🎉 ${selectedMovies.length} notes insérées pour l'utilisateur test.`);
  await appDataSource.destroy();
}

main().catch((err) => {
  console.error('❌ Erreur :', err);
});
