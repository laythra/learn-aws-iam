import { beforeEach, describe, expect, it, vi } from 'vitest';

import { clearCheckpoint, loadCheckpoint, saveCheckpoint } from './level-persistence';
import { LEVEL_VERSIONS } from '@/levels/level-versions';

const LEVEL = 1;
const CURRENT_VERSION = LEVEL_VERSIONS[LEVEL];
const STORAGE_KEY = `level${LEVEL}StateCheckpoint`;

const MOCK_SNAPSHOT = { status: 'active', value: 'playing', context: { score: 42 } };

function makeActor(snapshot = MOCK_SNAPSHOT): { getPersistedSnapshot: ReturnType<typeof vi.fn> } {
  return { getPersistedSnapshot: vi.fn().mockReturnValue(snapshot) };
}

function writeRawCheckpoint(value: unknown): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}

beforeEach(() => {
  localStorage.clear();
});

describe('saveCheckpoint', () => {
  it('writes the snapshot wrapped with the current level version', () => {
    saveCheckpoint(LEVEL, makeActor() as never);

    const raw = localStorage.getItem(STORAGE_KEY);
    expect(raw).not.toBeNull();

    const parsed = JSON.parse(raw!);
    expect(parsed.version).toBe(CURRENT_VERSION);
    expect(parsed.snapshot).toEqual(MOCK_SNAPSHOT);
  });
});

describe('loadCheckpoint', () => {
  it('returns the snapshot when version matches', () => {
    writeRawCheckpoint({ version: CURRENT_VERSION, snapshot: MOCK_SNAPSHOT });

    const result = loadCheckpoint(LEVEL);
    expect(result).toEqual(MOCK_SNAPSHOT);
  });

  it('returns undefined when version is outdated', () => {
    writeRawCheckpoint({ version: CURRENT_VERSION - 1, snapshot: MOCK_SNAPSHOT });

    expect(loadCheckpoint(LEVEL)).toBeUndefined();
  });

  it('returns undefined when no checkpoint is stored', () => {
    expect(loadCheckpoint(LEVEL)).toBeUndefined();
  });

  it('returns undefined for corrupted JSON', () => {
    localStorage.setItem(STORAGE_KEY, 'not valid json {');

    expect(loadCheckpoint(LEVEL)).toBeUndefined();
  });
});

describe('clearCheckpoint', () => {
  it('removes a stored checkpoint', () => {
    writeRawCheckpoint({ version: CURRENT_VERSION, snapshot: MOCK_SNAPSHOT });

    clearCheckpoint(LEVEL);

    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('does nothing when no checkpoint exists', () => {
    expect(() => clearCheckpoint(LEVEL)).not.toThrow();
  });
});

describe('saveCheckpoint + loadCheckpoint roundtrip', () => {
  it('saves and loads the same snapshot', () => {
    saveCheckpoint(LEVEL, makeActor() as never);

    expect(loadCheckpoint(LEVEL)).toEqual(MOCK_SNAPSHOT);
  });

  it('returns undefined after saving and then clearing', () => {
    saveCheckpoint(LEVEL, makeActor() as never);
    clearCheckpoint(LEVEL);

    expect(loadCheckpoint(LEVEL)).toBeUndefined();
  });
});
