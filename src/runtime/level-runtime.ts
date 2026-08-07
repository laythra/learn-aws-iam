import { createContext, useContext } from 'react';

import { createActorContext } from '@xstate/react';
import { Actor, Snapshot, SnapshotFrom } from 'xstate';

import { LEVEL_REGISTRY } from '@/levels/level-registry';
import type { AnyLevelMachine } from '@/levels/level-registry';
import { HydrateLevelRuntimeFns } from '@/levels/utils/functions-registry';

export type { AnyLevelMachine } from '@/levels/level-registry';

// Creating and using the context must be done separately from the provider.
// Otherwise, HMR breaks with a null context value, causing consumers to reference
// a previous context value that is no longer present in the upstream provider.
// The exact reason for this behavior is still unclear to me. See: https://github.com/vitejs/vite/issues/3301

// Type for the resolved actor context
export type LevelActorContext = ReturnType<typeof createActorContext<AnyLevelMachine>>;

export const CurrentActorContext = createContext<LevelActorContext | null>(null);

export async function loadLevelMachine(
  level: number,
  snapshot?: Snapshot<unknown>
): Promise<LevelActorContext> {
  const definition = LEVEL_REGISTRY[level];
  if (!definition) {
    throw new Error(`No state machine found for level ${level}`);
  }

  // Runtime fns must be hydrated before the machine starts resolving them by name
  const [{ stateMachine }] = await Promise.all([
    definition.load_state_machine(),
    HydrateLevelRuntimeFns(level),
  ]);
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
