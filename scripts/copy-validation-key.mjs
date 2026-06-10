import { copyFileSync } from 'node:fs';

copyFileSync('validation-key.txt', 'dist/validation-key.txt');
console.log('Copied validation-key.txt to dist/validation-key.txt');
