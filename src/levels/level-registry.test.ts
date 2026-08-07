import { describe, expect, it } from 'vitest';

import { LEVEL_REGISTRY, TOTAL_LEVELS } from './level-registry';
import {
  GetLevelGuardRailsBlockedEdgesFns,
  GetLevelObjectivesApplicableNodesFns,
  GetLevelValidateFunctions,
  HydrateLevelRuntimeFns,
} from './utils/functions-registry';

describe('LEVEL_REGISTRY', () => {
  it('has a contiguous entry for every level from 1 to TOTAL_LEVELS', () => {
    const levels = Object.keys(LEVEL_REGISTRY)
      .map(Number)
      .sort((a, b) => a - b);

    expect(levels).toEqual(Array.from({ length: TOTAL_LEVELS }, (__, i) => i + 1));
  });

  it('declares a positive checkpoint version for every level', () => {
    for (const [level, definition] of Object.entries(LEVEL_REGISTRY)) {
      expect(definition.checkpoint_version, `level ${level}`).toBeGreaterThanOrEqual(1);
    }
  });

  it('lazily loads a state machine for every level', async () => {
    for (const [level, definition] of Object.entries(LEVEL_REGISTRY)) {
      const { stateMachine } = await definition.load_state_machine();
      expect(stateMachine, `level ${level}`).toBeDefined();
    }
  });

  it('hydrates runtime functions for levels that declare them', async () => {
    await HydrateLevelRuntimeFns(12);

    expect(Object.keys(GetLevelValidateFunctions(12)).length).toBeGreaterThan(0);
    expect(Object.keys(GetLevelObjectivesApplicableNodesFns(12)).length).toBeGreaterThan(0);
    expect(Object.keys(GetLevelGuardRailsBlockedEdgesFns(12)).length).toBeGreaterThan(0);
  });

  it('resolves empty runtime functions for levels without them', async () => {
    await HydrateLevelRuntimeFns(1);

    expect(GetLevelValidateFunctions(1)).toEqual({});
    expect(GetLevelObjectivesApplicableNodesFns(1)).toEqual({});
    expect(GetLevelGuardRailsBlockedEdgesFns(1)).toEqual({});
  });
});
