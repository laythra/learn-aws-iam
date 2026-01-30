import { Actor, AnyActorLogic, Snapshot } from 'xstate';

import storage from '@/lib/storage';

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
  storage.setKey(
    `level${levelNumber}StateCheckpoint`,
    JSON.stringify(actor.getPersistedSnapshot())
  );
}

export function loadCheckpoint(levelNumber: number): Snapshot<unknown> | undefined {
  const raw = storage.getKey(`level${levelNumber}StateCheckpoint`);
  if (!raw) return undefined;

  try {
    return JSON.parse(raw);
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
