/**
 * Dev server for exporting stage snapshots to disk.
 *
 * The state machine has a `store_snapshot_to_disk` action that can be placed at any point
 * in a level's state machine. When triggered, it POSTs the current machine snapshot to this
 * server, which compresses it and writes it to the correct snapshot file.
 *
 * Usage:
 *   1. Start this server: node scripts/snapshot-server.mjs
 *   2. Start the dev server in a separate terminal: yarn dev (or make run-dev)
 *   3. Play through the level to the point where store_snapshot_to_disk fires
 *   4. The snapshot is written automatically to tests/e2e/level{N}/snapshots/{filename}.txt
 *
 * Adding a snapshot export point to a state machine:
 *   entry: [{ type: 'store_snapshot_to_disk', params: { filename: 'stage3' } }]
 *
 * Remove the action once the snapshot has been captured.
 */

import { writeFileSync, mkdirSync } from 'fs';
import { createServer } from 'http';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { gzipSync } from 'zlib';

const PORT = 3001;
const DEV_ORIGIN = process.env.DEV_ORIGIN ?? 'http://localhost:5173';
const MAX_BODY_BYTES = 1024 * 1024; // 1 MB
const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const server = createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', DEV_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.headers.origin !== DEV_ORIGIN) {
    res.writeHead(403);
    res.end(JSON.stringify({ error: 'Forbidden origin' }));
    return;
  }

  if (req.method !== 'POST' || req.url !== '/save') {
    res.writeHead(404);
    res.end();
    return;
  }

  let body = '';
  let bodyBytes = 0;
  let aborted = false;
  req.on('data', chunk => {
    if (aborted) return;
    bodyBytes += chunk.length;
    if (bodyBytes > MAX_BODY_BYTES) {
      aborted = true;
      res.writeHead(413);
      res.end(JSON.stringify({ error: 'Request body too large' }));
      req.destroy();
      return;
    }
    body += chunk;
  });
  req.on('end', () => {
    if (aborted) return;
    let parsed;
    try {
      parsed = JSON.parse(body);
    } catch {
      res.writeHead(400);
      res.end(JSON.stringify({ error: 'Invalid JSON' }));
      return;
    }

    const { content, filename, levelNumber } = parsed;

    if (
      typeof content !== 'string' ||
      typeof filename !== 'string' ||
      !Number.isSafeInteger(levelNumber)
    ) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: 'Invalid or missing content, filename, or levelNumber' }));
      return;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(filename)) {
      res.writeHead(400);
      res.end(
        JSON.stringify({
          error: 'filename must contain only alphanumeric characters, hyphens, or underscores',
        })
      );
      return;
    }

    const compressed = gzipSync(Buffer.from(content, 'utf-8')).toString('base64');
    const outDir = join(root, 'tests', 'e2e', `level${levelNumber}`, 'snapshots');
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, `${filename}.txt`), compressed);

    const outPath = `tests/e2e/level${levelNumber}/snapshots/${filename}.txt`;
    console.log(`Saved: ${outPath}`);

    res.writeHead(200);
    res.end(JSON.stringify({ saved: outPath }));
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Snapshot server running on http://localhost:${PORT}`);
  console.log('Waiting for store_snapshot_to_disk actions...');
});
