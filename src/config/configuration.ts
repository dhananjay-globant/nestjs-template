import * as fs from 'fs';
import * as path from 'path';

import * as dotenv from 'dotenv';

function loadEnvFile(filePath: string): void {
  if (fs.existsSync(filePath)) {
    dotenv.config({ path: filePath });
  }
}

export function loadEnvConfig() {
  const nodeEnv = process.env.NODE_ENV || 'development';

  // Load environment files in the specified order
  loadEnvFile(path.resolve('.env.local'));
  loadEnvFile(path.resolve(`.env.${nodeEnv}`));
  loadEnvFile(path.resolve('.env'));
}
