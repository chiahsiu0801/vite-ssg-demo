#!/usr/bin/env node

/**
 * Simple utility script to switch between CSR and SSG modes
 * Usage: node switch-mode.js csr|ssg
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const indexPath = path.join(__dirname, 'index.html');

// Get the mode from command line arguments
const mode = process.argv[2]?.toLowerCase();

if (!mode || (mode !== 'csr' && mode !== 'ssg')) {
  console.error('Please specify a valid mode: csr or ssg');
  process.exit(1);
}

// Read the current index.html
let indexContent = fs.readFileSync(indexPath, 'utf8');

// Replace the script tag with the appropriate main file
if (mode === 'csr') {
  indexContent = indexContent.replace(
    /<script type="module" src="\/src\/main-.*\.js"><\/script>/,
    '<script type="module" src="/src/main-csr.js"></script>'
  );
  console.log('Switched to CSR mode');
} else {
  indexContent = indexContent.replace(
    /<script type="module" src="\/src\/main-.*\.js"><\/script>/,
    '<script type="module" src="/src/main-ssg.js"></script>'
  );
  console.log('Switched to SSG mode');
}

// Write the updated content back to index.html
fs.writeFileSync(indexPath, indexContent); 