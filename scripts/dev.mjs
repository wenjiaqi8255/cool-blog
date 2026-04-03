// dev.mjs - Load .dev.vars before running dev server
import 'dotenv/config';

// Just run npm run dev - dotenv/config already loaded env vars
import { spawn } from 'child_process';

const child = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  cwd: process.cwd(),
  shell: true
});

child.on('exit', (code) => {
  process.exit(code);
});