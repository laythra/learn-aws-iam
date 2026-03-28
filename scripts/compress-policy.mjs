/**
 * Compresses a policy JSON file into a base64-encoded gzip string for use in e2e tests.
 *
 * Policy solutions in e2e tests are stored as compressed `.txt` files to discourage
 * casual browsing of answers. This script takes a raw JSON policy file and produces
 * the compressed output that `getTestSolution` in `tests/e2e/helpers/test-solutions.ts`
 * knows how to decode.
 *
 * Usage:
 *   node scripts/compress-policy.mjs <input.json> [output.txt]
 *
 * Examples:
 *   # Print compressed output to stdout
 *   node scripts/compress-policy.mjs policy.json
 *
 *   # Write directly to the e2e policies directory
 *   node scripts/compress-policy.mjs policy.json tests/e2e/level8/policies/policy1.txt
 *
 * The input file must be valid JSON. Formatting and whitespace are stripped before
 * compression — the decompressed value in tests is always minified JSON.
 */

import { readFileSync, writeFileSync } from 'fs';
import { gzipSync } from 'zlib';

const [, , inputPath, outputPath] = process.argv;

if (!inputPath) {
  console.error('Usage: node scripts/compress-policy.mjs <input.json> [output.txt]');
  process.exit(1);
}

let raw;
try {
  raw = readFileSync(inputPath, 'utf-8');
} catch {
  console.error(`Error: could not read file "${inputPath}"`);
  process.exit(1);
}

let parsed;
try {
  parsed = JSON.parse(raw);
} catch {
  console.error(`Error: "${inputPath}" is not valid JSON`);
  process.exit(1);
}

const compressed = gzipSync(Buffer.from(JSON.stringify(parsed), 'utf-8')).toString('base64');

if (outputPath) {
  writeFileSync(outputPath, compressed, 'utf-8');
  console.log(`Written to ${outputPath}`);
} else {
  console.log(compressed);
}
