import 'dotenv/config';
import { execSync } from 'child_process';

try {
  execSync('npx typeorm migration:revert --dataSource ./datasource.js --dataSource', { stdio: 'inherit' });
} catch (e) {
  console.error('Error during migration revert:', e);
  process.exit(1);
}
