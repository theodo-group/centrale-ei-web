require('dotenv').config();
const { execSync } = require('child_process');

const date = new Date().toISOString().replace(/[-T:\.Z]/g, '');
const migrationName = `migrations/migration_${date}`;

console.log('Generating migration:', migrationName);

try {
  execSync(`npx typeorm migration:generate --dataSource ./datasource.js --outputJs --pretty ${migrationName}`, { stdio: 'inherit' });
} catch (e) {
  console.error('Error during migration generation:', e);
  process.exit(1);
}

//rm -rf node_modules/.cache
//rm -rf node_modules
