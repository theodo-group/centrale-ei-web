const { appDataSource } = require('../datasource');
const User = require('../entities/user');
const Movie = require('../entities/movies');
const Rating = require('../entities/ratings');

async function main() {
  await appDataSource.initialize();
  console.log('📦 Base de données connectée.');

  const userRepo = appDataSource.getRepository(User);
  const movieRepo = appDataSource.getRepository(Movie);
  const ratingRepo = appDataSource.getRepository(Rating);

  // Créer ou récupérer un utilisateur
  let user = await userRepo.findOneBy({ email: 'testuser@example.com' });

  if (!user) {
    user = userRepo.create({
      email: 'testuser@example.com',
      firstname: 'Test',
      lastname: 'User',
    });
    await userRepo.save(user);
    console.log(`👤 Utilisateur créé : ${user.firstname} ${user.lastname} (ID: ${user.id})`);
  } else {
    console.log(`👤 Utilisateur déjà existant : ${user.firstname} ${user.lastname} (ID: ${user.id})`);
  }

  // Récupérer quelques films
  const movies = await movieRepo.find({ take: 10 });

  if (movies.length === 0) {
    console.log('❌ Aucun film trouvé. Exécute d’abord le seed TMDB.');
    return;
  }

  for (const movie of movies) {
    const existingRating = await ratingRepo.findOneBy({
      user: { id: user.id },
      movie: { id: movie.id },
    });

    const ratingValue = Math.round((Math.random() * 4 + 1) * 2) / 2;

    if (existingRating) {
      existingRating.value = ratingValue;
      await ratingRepo.save(existingRating);
      console.log(`🔁 Note mise à jour pour "${movie.title}" : ${ratingValue}/5`);
    } else {
      const rating = ratingRepo.create({
        user,
        movie,
        value: ratingValue,
      });
      await ratingRepo.save(rating);
      console.log(`✅ Note ajoutée : "${movie.title}" - ${ratingValue}/5`);
    }
  }

  console.log('🎉 Données de test insérées avec succès.');
  await appDataSource.destroy();
}

main().catch((err) => {
  console.error('❌ Erreur :', err);
});
