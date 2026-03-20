import { describe, expect, it } from 'vitest';

import { LevelDetailsStore } from '@/runtime/level-store';

function freshStore(): typeof LevelDetailsStore {
  // Reset to initial state before each test by sending initialize
  LevelDetailsStore.send({ type: 'initialize', levelNumber: 1, maxLevelReached: 1 });
  return LevelDetailsStore;
}

describe('LevelDetailsStore', () => {
  it('has correct initial state', () => {
    const store = freshStore();
    const state = store.getSnapshot().context;
    expect(state.levelNumber).toBe(1);
    expect(state.maxLevelReached).toBe(1);
  });

  it('setLevelNumber updates levelNumber and increments restartKey', () => {
    const store = freshStore();
    const prevKey = store.getSnapshot().context.restartKey;

    store.send({ type: 'setLevelNumber', levelNumber: 5 });
    const state = store.getSnapshot().context;

    expect(state.levelNumber).toBe(5);
    expect(state.restartKey).toBe(prevKey + 1);
  });

  it('incrementLevelNumber increments by one and bumps restartKey', () => {
    const store = freshStore();
    store.send({ type: 'setLevelNumber', levelNumber: 3 });
    const prevKey = store.getSnapshot().context.restartKey;

    store.send({ type: 'incrementLevelNumber' });
    const state = store.getSnapshot().context;

    expect(state.levelNumber).toBe(4);
    expect(state.restartKey).toBe(prevKey + 1);
  });

  it('returnToLastCheckpoint only increments restartKey', () => {
    const store = freshStore();
    store.send({ type: 'setLevelNumber', levelNumber: 7 });
    const prevState = store.getSnapshot().context;

    store.send({ type: 'returnToLastCheckpoint' });
    const state = store.getSnapshot().context;

    expect(state.levelNumber).toBe(prevState.levelNumber);
    expect(state.restartKey).toBe(prevState.restartKey + 1);
  });

  it('restartLevel only increments restartKey', () => {
    const store = freshStore();
    store.send({ type: 'setLevelNumber', levelNumber: 3 });
    const prevState = store.getSnapshot().context;

    store.send({ type: 'restartLevel' });
    const state = store.getSnapshot().context;

    expect(state.levelNumber).toBe(prevState.levelNumber);
    expect(state.restartKey).toBe(prevState.restartKey + 1);
  });

  it('initialize sets levelNumber and maxLevelReached', () => {
    const store = freshStore();
    store.send({ type: 'initialize', levelNumber: 8, maxLevelReached: 10 });
    const state = store.getSnapshot().context;

    expect(state.levelNumber).toBe(8);
    expect(state.maxLevelReached).toBe(10);
  });

  it('setMaxLevelReached updates maxLevelReached', () => {
    const store = freshStore();
    store.send({ type: 'setMaxLevelReached', maxLevelReached: 6 });
    const state = store.getSnapshot().context;

    expect(state.maxLevelReached).toBe(6);
  });
});
