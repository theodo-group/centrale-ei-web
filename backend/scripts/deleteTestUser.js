const { appDataSource } = require('../datasource');
const { User } = require('../entities/user');  // <-- déstructure selon export
const { Rating } = require('../entities/ratings');

async function main() {
  await appDataSource.initialize();
  console.log('🗑 Connexion OK');

  const userRepo = appDataSource.getRepository(User);
  const ratingRepo = appDataSource.getRepository(Rating);

  const user = await userRepo.findOne({
    where: { email: 'testuser@example.com' },
    relations: ['ratings'],
  });

  if (!user) {
    console.log('⚠️ Utilisateur non trouvé.');
    return;
  }

  console.log(`🔎 Suppression de ${user.email} (ID: ${user.id})`);

  // Supprimer les notes explicitement
  await ratingRepo.delete({ user: { id: user.id } });

  // Supprimer l'utilisateur
  await userRepo.remove(user);

  console.log('✅ Utilisateur et notes supprimés.');
  await appDataSource.destroy();
}

main().catch((err) => {
  console.error('❌ Erreur :', err);
});
