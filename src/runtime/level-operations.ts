import { Actor, AnyActorLogic } from 'xstate';

import * as analytics from './level-analytics';
import * as persistence from './level-persistence';
import { LevelDetailsStore } from './level-store';
import { TOTAL_LEVELS } from '@/config/consts';
import { LevelEventBus } from '@/levels/level-event-bus';

function startLevel(levelNumber: number): void {
  persistence.setCurrentLevel(levelNumber);
  LevelDetailsStore.send({ type: 'setLevelNumber', levelNumber });
  analytics.logLevelStarted(levelNumber);
}

function finishCurrentLevel(): void {
  const levelNumber = LevelDetailsStore.getSnapshot().context.levelNumber;
  persistence.clearCheckpoint(levelNumber);
  analytics.logLevelFinished(levelNumber);
}

function setMaxLevelReached(maxReachedLevel: number): void {
  LevelDetailsStore.send({ type: 'setMaxLevelReached', maxLevelReached: maxReachedLevel });
  persistence.setMaxLevelReached(maxReachedLevel);
}

export function advanceToNextLevel(): void {
  const currentLevelNumber = LevelDetailsStore.getSnapshot().context.levelNumber;
  const maxReachedLevel = LevelDetailsStore.getSnapshot().context.maxLevelReached;
  const nextLevelNumber = currentLevelNumber === TOTAL_LEVELS ? 1 : currentLevelNumber + 1;

  finishCurrentLevel();
  startLevel(nextLevelNumber);

  if (nextLevelNumber > maxReachedLevel) {
    setMaxLevelReached(nextLevelNumber);
  }
}

export function pickLevel(levelNumber: number): void {
  const maxReachedLevel = LevelDetailsStore.getSnapshot().context.maxLevelReached;

  if (levelNumber < 1 || levelNumber > TOTAL_LEVELS) return;
  if (levelNumber > maxReachedLevel) return;

  const currentLevel = LevelDetailsStore.getSnapshot().context.levelNumber;

  persistence.clearCheckpoint(currentLevel);
  persistence.setCurrentLevel(levelNumber);
  LevelDetailsStore.send({ type: 'setLevelNumber', levelNumber });
  analytics.logLevelSelected(levelNumber);
}

export function initializeLevelStore(): void {
  const savedLevel = persistence.getCurrentLevel();
  const maxLevelReached = persistence.getMaxLevelReached();
  const levelNumber = savedLevel ?? 1;

  if (!savedLevel) {
    // First time playing: initialize persistence, store, and analytics without triggering a restart
    persistence.setCurrentLevel(levelNumber);
    LevelDetailsStore.send({ type: 'initialize', levelNumber, maxLevelReached });
    analytics.logLevelStarted(levelNumber);
  } else {
    LevelDetailsStore.send({ type: 'initialize', levelNumber, maxLevelReached });
  }
}

export function storeLevelCheckpoint(actor: Actor<AnyActorLogic>): void {
  const levelNumber = LevelDetailsStore.getSnapshot().context.levelNumber;
  persistence.saveCheckpoint(levelNumber, actor);
  analytics.logCheckpointSaved(levelNumber);
}

export function restartLevelFromStart(): void {
  const levelNumber = LevelDetailsStore.getSnapshot().context.levelNumber;
  persistence.clearCheckpoint(levelNumber);
  LevelDetailsStore.send({ type: 'restartLevel' });
  analytics.logRestartFromStart(levelNumber);
}

export function restartLevelFromCheckpoint(): void {
  const levelNumber = LevelDetailsStore.getSnapshot().context.levelNumber;
  LevelDetailsStore.send({ type: 'returnToLastCheckpoint' });
  analytics.logRestartFromCheckpoint(levelNumber);
}

const SNAPSHOT_SERVER_URL = import.meta.env.VITE_SNAPSHOT_SERVER_URL ?? 'http://localhost:3001';

async function saveSnapshotToDisk(
  actor: Actor<AnyActorLogic>,
  filename: string,
  levelNumber: number
): Promise<void> {
  const content = JSON.stringify(actor.getPersistedSnapshot());
  const res = await fetch(`${SNAPSHOT_SERVER_URL}/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, filename, levelNumber }),
  });
  if (!res.ok) {
    let bodyText: string | undefined;
    try {
      bodyText = await res.text();
    } catch {
      bodyText = undefined;
    }
    const message =
      `[snapshot] Server responded ${res.status} for ${filename}` +
      (bodyText ? `: ${bodyText}` : '');
    throw new Error(message);
  }
}

// Subscribe to events from levels (breaks the levels → runtime import cycle)
LevelEventBus.on('store_checkpoint', ({ actor }) => storeLevelCheckpoint(actor));
LevelEventBus.on('store_snapshot_to_disk', ({ actor, filename }) => {
  if (!import.meta.env.DEV) return;
  const levelNumber = LevelDetailsStore.getSnapshot().context.levelNumber;
  saveSnapshotToDisk(actor, filename, levelNumber).catch(err =>
    console.error('[snapshot] Failed to save snapshot:', err)
  );
});
