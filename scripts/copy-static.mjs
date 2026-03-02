import { mkdirSync, copyFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const projectRoot = resolve(process.cwd());

const copies = [
  { from: 'src/index.html', to: 'dist/index.html' },
  { from: 'src/preload.js', to: 'dist/preload.js' }
];

for (const { from, to } of copies) {
  const source = resolve(projectRoot, from);
  const target = resolve(projectRoot, to);

  mkdirSync(dirname(target), { recursive: true });
  copyFileSync(source, target);
}

console.log('Copied static runtime files to dist/');