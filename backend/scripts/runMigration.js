require('dotenv').config();
const { execSync } = require('child_process');

try {
  execSync('npx typeorm migration:run --dataSource ./datasource.js', { stdio: 'inherit' });
} catch (e) {
  console.error('Error during migration run:', e);
  process.exit(1);
}
