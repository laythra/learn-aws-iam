import { analyticsActor } from '@/lib/analytics-actor';

export function logLevelStarted(levelNumber: number): void {
  analyticsActor.send({
    type: 'LOG_EVENT',
    name: 'LEVEL_STARTED',
    payload: { levelNumber },
  });
}

export function logLevelFinished(levelNumber: number): void {
  analyticsActor.send({
    type: 'LOG_EVENT',
    name: 'LEVEL_FINISHED',
    payload: { levelNumber },
  });
}

export function logCheckpointSaved(levelNumber: number): void {
  analyticsActor.send({
    type: 'LOG_EVENT',
    name: 'LEVEL_CHECKPOINT_SAVED',
    payload: { levelNumber },
  });
}

export function logRestartFromStart(levelNumber: number): void {
  analyticsActor.send({
    type: 'LOG_EVENT',
    name: 'LEVEL_RESTARTED_FROM_START',
    payload: { levelNumber },
  });
}

export function logRestartFromCheckpoint(levelNumber: number): void {
  analyticsActor.send({
    type: 'LOG_EVENT',
    name: 'LEVEL_RESTARTED_FROM_CHECKPOINT',
    payload: { levelNumber },
  });
}

/**
 * Log when a user selects a level from the level picker
 * @param levelNumber
 */
export function logLevelSelected(levelNumber: number): void {
  analyticsActor.send({
    type: 'LOG_EVENT',
    name: 'LEVEL_SELECTED',
    payload: { levelNumber },
  });
}
