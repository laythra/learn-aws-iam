import { Actor, AnyActorLogic } from 'xstate';

import * as analytics from './level-analytics';
import * as persistence from './level-persistence';
import { LevelDetailsStore } from './level-store';

const MAX_LEVEL_NUMBER = 12;

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
  const nextLevelNumber = currentLevelNumber == 12 ? 1 : currentLevelNumber + 1;

  finishCurrentLevel();
  startLevel(nextLevelNumber);

  if (nextLevelNumber > maxReachedLevel) {
    setMaxLevelReached(nextLevelNumber);
  }
}

export function pickLevel(levelNumber: number): void {
  const maxReachedLevel = LevelDetailsStore.getSnapshot().context.maxLevelReached;

  if (levelNumber < 1 || levelNumber > MAX_LEVEL_NUMBER) return;
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

/** DEBUG ONLY
 * Saves the current snapshot of the given actor to disk via a local server.
 * This is only for debugging and development purposes.
 */
export function saveSnapshotToDisk(actor: Actor<AnyActorLogic>, filename: string): void {
  const snapshot = actor.getPersistedSnapshot();
  const snapshotString = JSON.stringify(snapshot);

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
    .then(response => {
      if (!response.ok) {
        console.error(
          `Failed to save snapshot to disk (status ${response.status} ${response.statusText})`
        );
      }
    })
    .catch(error => {
      console.error('Error while saving snapshot to disk', error);
    });
}
