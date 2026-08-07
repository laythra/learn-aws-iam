/**
 * Single source of truth for level registration.
 *
 * Adding a level means creating its `src/levels/level{N}/` folder and adding ONE entry here.
 * Everything else derives from this map:
 * - `runtime/level-runtime.ts` builds its lazy state-machine loaders from `load_state_machine`
 *   and hydrates `load_runtime_fns` before the machine starts
 * - `levels/utils/functions-registry.ts` resolves runtime functions from the hydrated fns
 * - `runtime/level-persistence.ts` versions checkpoints with `checkpoint_version`
 * - `TOTAL_LEVELS` is derived from the number of entries
 *
 * Keep `load_state_machine` and `load_runtime_fns` dynamic-import thunks — static imports here
 * would pull every level into the eager bundle and kill per-level code splitting.
 */
import type { ValidateFunction } from 'ajv';

import type { stateMachine as level1StateMachine } from '@/levels/level1/state-machine';
import type { stateMachine as level10StateMachine } from '@/levels/level10/state-machine';
import type { stateMachine as level11StateMachine } from '@/levels/level11/state-machine';
import type { stateMachine as level12StateMachine } from '@/levels/level12/state-machine';
import type { stateMachine as level2StateMachine } from '@/levels/level2/state-machine';
import type { stateMachine as level3StateMachine } from '@/levels/level3/state-machine';
import type { stateMachine as level4StateMachine } from '@/levels/level4/state-machine';
import type { stateMachine as level5StateMachine } from '@/levels/level5/state-machine';
import type { stateMachine as level6StateMachine } from '@/levels/level6/state-machine';
import type { stateMachine as level7StateMachine } from '@/levels/level7/state-machine';
import type { stateMachine as level8StateMachine } from '@/levels/level8/state-machine';
import type { stateMachine as level9StateMachine } from '@/levels/level9/state-machine';
import { IAMAnyNode, IAMEdge } from '@/types/iam-node-types';

// Union type of all level state machines for proper type inference
export type AnyLevelMachine =
  | typeof level1StateMachine
  | typeof level2StateMachine
  | typeof level3StateMachine
  | typeof level4StateMachine
  | typeof level5StateMachine
  | typeof level6StateMachine
  | typeof level7StateMachine
  | typeof level8StateMachine
  | typeof level9StateMachine
  | typeof level10StateMachine
  | typeof level11StateMachine
  | typeof level12StateMachine;

export type LevelRuntimeFns = {
  objectives_applicable_nodes_fns: Record<string, (nodes: IAMAnyNode[]) => IAMAnyNode[]>;
  objectives_guard_rails_blocked_edges_fns: Record<string, (edge: IAMEdge) => boolean>;
  validate_functions: Record<string, (nodes: IAMAnyNode[]) => ValidateFunction>;
};

export interface LevelDefinition {
  /**
   * Versioned checkpoint marker. Bump it whenever the level changes in a way that would make
   * an existing user checkpoint invalid or incompatible (e.g. new objectives, restructured
   * state, changed node IDs). This forces affected users to restart the level from scratch
   * instead of resuming a stale checkpoint.
   */
  checkpoint_version: number;
  /** Lazy loader for the level's state machine — must stay a dynamic import (code splitting). */
  load_state_machine: () => Promise<{ stateMachine: AnyLevelMachine }>;
  /**
   * Lazy loader for the runtime functions referenced by *name* from the level's serializable
   * machine context. Hydrated by `loadLevelMachine` before the machine starts; levels without
   * runtime functions omit this.
   */
  load_runtime_fns?: () => Promise<Partial<LevelRuntimeFns>>;
}

const cast = (m: { stateMachine: unknown }): { stateMachine: AnyLevelMachine } => ({
  stateMachine: m.stateMachine as AnyLevelMachine,
});

export const LEVEL_REGISTRY: Record<number, LevelDefinition> = {
  1: {
    checkpoint_version: 1,
    load_state_machine: () => import('@/levels/level1/state-machine').then(cast),
  },
  2: {
    checkpoint_version: 1,
    load_state_machine: () => import('@/levels/level2/state-machine').then(cast),
  },
  3: {
    checkpoint_version: 1,
    load_state_machine: () => import('@/levels/level3/state-machine').then(cast),
    load_runtime_fns: () =>
      import('@/levels/level3/level-runtime-fns').then(m => ({
        validate_functions: m.ValidateFunctions,
      })),
  },
  4: {
    checkpoint_version: 1,
    load_state_machine: () => import('@/levels/level4/state-machine').then(cast),
    load_runtime_fns: () =>
      import('@/levels/level4/level-runtime-fns').then(m => ({
        validate_functions: m.ValidateFunctions,
      })),
  },
  5: {
    checkpoint_version: 1,
    load_state_machine: () => import('@/levels/level5/state-machine').then(cast),
    load_runtime_fns: () =>
      import('@/levels/level5/level-runtime-fns').then(m => ({
        validate_functions: m.ValidateFunctions,
      })),
  },
  6: {
    checkpoint_version: 1,
    load_state_machine: () => import('@/levels/level6/state-machine').then(cast),
    load_runtime_fns: () =>
      import('@/levels/level6/level-runtime-fns').then(m => ({
        validate_functions: m.ValidateFunctions,
      })),
  },
  7: {
    checkpoint_version: 1,
    load_state_machine: () => import('@/levels/level7/state-machine').then(cast),
    load_runtime_fns: () =>
      import('@/levels/level7/level-runtime-fns').then(m => ({
        validate_functions: m.ValidateFunctions,
      })),
  },
  8: {
    checkpoint_version: 1,
    load_state_machine: () => import('@/levels/level8/state-machine').then(cast),
    load_runtime_fns: () =>
      import('@/levels/level8/level-runtime-fns').then(m => ({
        objectives_applicable_nodes_fns: m.ObjectivesApplicableNodesFns,
        validate_functions: m.ValidateFunctions,
      })),
  },
  9: {
    checkpoint_version: 1,
    load_state_machine: () => import('@/levels/level9/state-machine').then(cast),
    load_runtime_fns: () =>
      import('@/levels/level9/level-runtime-fns').then(m => ({
        objectives_applicable_nodes_fns: m.ObjectivesApplicableNodesFns,
        validate_functions: m.ValidateFunctions,
      })),
  },
  10: {
    checkpoint_version: 1,
    load_state_machine: () => import('@/levels/level10/state-machine').then(cast),
    load_runtime_fns: () =>
      import('@/levels/level10/level-runtime-fns').then(m => ({
        objectives_applicable_nodes_fns: m.ObjectivesApplicableNodesFns,
        validate_functions: m.ValidateFunctions,
      })),
  },
  11: {
    checkpoint_version: 1,
    load_state_machine: () => import('@/levels/level11/state-machine').then(cast),
    load_runtime_fns: () =>
      import('@/levels/level11/level-runtime-fns').then(m => ({
        validate_functions: m.ValidateFunctions,
        objectives_guard_rails_blocked_edges_fns: m.GuardRailsBlockedEdgesFunctions,
      })),
  },
  12: {
    checkpoint_version: 1,
    load_state_machine: () => import('@/levels/level12/state-machine').then(cast),
    load_runtime_fns: () =>
      import('@/levels/level12/level-runtime-fns').then(m => ({
        objectives_applicable_nodes_fns: m.ObjectivesApplicableNodesFns,
        validate_functions: m.ValidateFunctions,
        objectives_guard_rails_blocked_edges_fns: m.GuardRailsBlockedEdgesFunctions,
      })),
  },
};

export const TOTAL_LEVELS = Object.keys(LEVEL_REGISTRY).length;
