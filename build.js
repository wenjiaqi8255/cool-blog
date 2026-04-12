#!/usr/bin/env node

import { execFileSync } from 'child_process';

// Read platform from environment variable, default to 'node'
const platform = process.env.DEPLOY_PLATFORM || 'node';

console.log(`\x1b[36m%s\x1b[0m`, `[build] Building for platform: ${platform}`);
console.log(`\x1b[90m%s\x1b[0m`, `[build] DEPLOY_PLATFORM: ${process.env.DEPLOY_PLATFORM || '(not set, using default: node)'}\n`);

// Execute Astro build using execFileSync for security
// This prevents shell injection vulnerabilities by separating command from arguments
const command = 'npx';
const args = ['astro', 'build'];

try {
  execFileSync(command, args, {
    stdio: 'inherit',
    env: { ...process.env, DEPLOY_PLATFORM: platform }
  });
  console.log(`\n\x1b[32m%s\x1b[0m`, `[build] ✓ Build completed for ${platform}`);
} catch (error) {
  console.error(`\n\x1b[31m%s\x1b[0m`, `[build] ✗ Build failed for ${platform}`);
  process.exit(1);
}
