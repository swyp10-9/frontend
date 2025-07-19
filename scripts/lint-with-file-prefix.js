#!/usr/bin/env node
import { execSync } from 'child_process';
import path from 'path';

const files = process.argv.slice(2);
if (files.length === 0) {
  process.exit(0);
}

const fileArgs = files
  .map(f => `--file ${path.relative(process.cwd(), f)}`)
  .join(' ');

const command = `yarn exec next lint ${fileArgs}`;

try {
  execSync(command, { stdio: 'inherit' });
} catch (error) {
  process.exit(1);
}
