import { Actor, AnyActorLogic, Snapshot } from 'xstate';

import { LevelDetailsStore } from './store';
import storage from '@/lib/storage';

/**
 * Initialize store from localStorage
 */
export function initializeLevelStore(): void {
  const savedLevel = storage.getKey('currentLevel');
  const parsedLevel = parseInt(savedLevel, 10);
  const levelNumber = Number.isNaN(parsedLevel) ? 1 : parsedLevel;

  if (savedLevel) {
    LevelDetailsStore.send({
      type: 'setLevelNumber',
      levelNumber,
    });
  }
}

/**
 * Store level checkpoint
 */
export function storeLevelCheckpoint(actor: Actor<AnyActorLogic>): void {
  const levelNumber = LevelDetailsStore.getSnapshot().context.levelNumber;
  storage.setKey(
    `level${levelNumber}StateCheckpoint`,
    JSON.stringify(actor.getPersistedSnapshot())
  );
}

/**
 * Get level snapshot from storage
 */
export function getLevelSnapshotFromStorage(levelNumber: number): Snapshot<unknown> | undefined {
  const snapshotRaw = storage.getKey(`level${levelNumber}StateCheckpoint`);

  let snapshot: Snapshot<unknown> | undefined;

  try {
    snapshot = snapshotRaw ? JSON.parse(snapshotRaw) : undefined;
  } catch {
    snapshot = undefined;
  }

  return snapshot;
}

/**
 * Clear level checkpoint
 */
export function restartLevelFromStart(): void {
  const levelNumber = LevelDetailsStore.getSnapshot().context.levelNumber;
  storage.removeKey(`level${levelNumber}StateCheckpoint`);
  LevelDetailsStore.send({ type: 'restartLevel' });
}

export function restartLevelFromCheckpoint(): void {
  LevelDetailsStore.send({ type: 'returnToLastCheckpoint' });
}

export function setLevel(levelNumber: number): void {
  const previousLevelNumber = LevelDetailsStore.getSnapshot().context.levelNumber;
  if (levelNumber === previousLevelNumber) return;

  storage.setKey('currentLevel', levelNumber.toString());
  storage.removeKey(`level${levelNumber}StateCheckpoint`);
  LevelDetailsStore.send({ type: 'setLevelNumber', levelNumber });
}

/**
 * Save snapshot to disk (debug only)
 */
export function saveSnapshotToDisk(actor: Actor<AnyActorLogic>, filename: string): void {
  const levelNumber = LevelDetailsStore.getSnapshot().context.levelNumber;
  const snapshot = actor.getPersistedSnapshot();
  const snapshotString = JSON.stringify(snapshot);

  storage.setKey(`level${levelNumber}StateCheckpoint`, snapshotString);

  fetch('http://localhost:3001/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content: snapshotString,
      filename,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        console.error(
          `Failed to save snapshot to disk (status ${response.status} ${response.statusText})`
        );
      }
    })
    .catch((error) => {
      console.error('Error while saving snapshot to disk', error);
    });
}
