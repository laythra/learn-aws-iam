import { Actor, AnyActorLogic, Snapshot } from 'xstate';

import { LEVEL_VERSIONS } from '@/levels/level-versions';
import storage from '@/lib/storage';

type Checkpoint = {
  version: number;
  snapshot: Snapshot<unknown>;
};

export function getCurrentLevel(): number | null {
  const raw = storage.getKey('currentLevel');
  const parsed = parseInt(raw ?? '', 10);
  return Number.isNaN(parsed) ? null : parsed;
}

export function setCurrentLevel(levelNumber: number): void {
  storage.setKey('currentLevel', levelNumber.toString());
}

export function clearCheckpoint(levelNumber: number): void {
  storage.removeKey(`level${levelNumber}StateCheckpoint`);
}

export function saveCheckpoint(levelNumber: number, actor: Actor<AnyActorLogic>): void {
  const checkpoint: Checkpoint = {
    version: LEVEL_VERSIONS[levelNumber],
    snapshot: actor.getPersistedSnapshot(),
  };

  storage.setKey(`level${levelNumber}StateCheckpoint`, JSON.stringify(checkpoint));
}

export function loadCheckpoint(levelNumber: number): Snapshot<unknown> | undefined {
  const raw = storage.getKey(`level${levelNumber}StateCheckpoint`);
  if (!raw) return undefined;

  try {
    const parsed = JSON.parse(raw) as Checkpoint;
    if (parsed.version !== LEVEL_VERSIONS[levelNumber]) return undefined;
    return parsed.snapshot;
  } catch {
    return undefined;
  }
}

export function getMaxLevelReached(): number {
  const raw = storage.getKey('maximumLevelNumber');
  const parsed = raw ? parseInt(raw, 10) : 1;
  return Number.isNaN(parsed) ? 1 : parsed;
}

export function setMaxLevelReached(levelNumber: number): void {
  storage.setKey('maximumLevelNumber', levelNumber.toString());
}
