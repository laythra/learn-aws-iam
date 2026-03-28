import { createContext, useContext } from 'react';

import { createActorContext } from '@xstate/react';
import { Actor, Snapshot, SnapshotFrom } from 'xstate';

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

// Creating and using the context must be done separately from the provider.
// Otherwise, HMR breaks with a null context value, causing consumers to reference
// a previous context value that is no longer present in the upstream provider.
// The exact reason for this behavior is still unclear to me. See: https://github.com/vitejs/vite/issues/3301

// Type for the resolved actor context
export type LevelActorContext = ReturnType<typeof createActorContext<AnyLevelMachine>>;

export const CurrentActorContext = createContext<LevelActorContext | null>(null);

const cast = (m: { stateMachine: unknown }): { stateMachine: AnyLevelMachine } => ({
  stateMachine: m.stateMachine as AnyLevelMachine,
});

const loaders: Record<number, () => Promise<{ stateMachine: AnyLevelMachine }>> = {
  1: () => import('@/levels/level1/state-machine').then(cast),
  2: () => import('@/levels/level2/state-machine').then(cast),
  3: () => import('@/levels/level3/state-machine').then(cast),
  4: () => import('@/levels/level4/state-machine').then(cast),
  5: () => import('@/levels/level5/state-machine').then(cast),
  6: () => import('@/levels/level6/state-machine').then(cast),
  7: () => import('@/levels/level7/state-machine').then(cast),
  8: () => import('@/levels/level8/state-machine').then(cast),
  9: () => import('@/levels/level9/state-machine').then(cast),
  10: () => import('@/levels/level10/state-machine').then(cast),
  11: () => import('@/levels/level11/state-machine').then(cast),
  12: () => import('@/levels/level12/state-machine').then(cast),
};

export async function loadLevelMachine(
  level: number,
  snapshot?: Snapshot<unknown>
): Promise<LevelActorContext> {
  const loader = loaders[level];
  if (!loader) {
    throw new Error(`No state machine found for level ${level}`);
  }

  const { stateMachine } = await loader();
  return createActorContext(stateMachine, { snapshot });
}

export function LevelsProgressionContext(): LevelActorContext {
  const ctx = useContext(CurrentActorContext);
  if (!ctx) {
    throw new Error('useLevelsProgressionContext must be used within a LevelsProgressionProvider');
  }

  return ctx;
}

export function useLevelSelector<T>(
  selector: (state: SnapshotFrom<AnyLevelMachine>) => T,
  compare?: (a: T, b: T) => boolean
): T {
  const LevelsProgressionCtx = LevelsProgressionContext();
  return LevelsProgressionCtx.useSelector(selector, compare);
}

export function useLevelActor(): Actor<AnyLevelMachine> {
  return LevelsProgressionContext().useActorRef();
}
