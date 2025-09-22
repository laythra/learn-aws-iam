import { createContext, useContext } from 'react';

import { createActorContext } from '@xstate/react';
import { Snapshot } from 'xstate';

import { stateMachine as level1StateMachine } from '@/machines/level1/state-machine';
import { stateMachine as level10StateMachine } from '@/machines/level10/state-machine';
import { stateMachine as level11StateMachine } from '@/machines/level11/state-machine';
import { stateMachine as level12StateMachine } from '@/machines/level12/state-machine';
import { stateMachine as level2StateMachine } from '@/machines/level2/state-machine';
import { stateMachine as level3StateMachine } from '@/machines/level3/state-machine';
import { stateMachine as level4StateMachine } from '@/machines/level4/state-machine';
import { stateMachine as level5StateMachine } from '@/machines/level5/state-machine';
import { stateMachine as leve6StateMachine } from '@/machines/level6/state-machine';
import { stateMachine as level7StateMachine } from '@/machines/level7/state-machine';
import { stateMachine as level8StateMachine } from '@/machines/level8/state-machine';
import { stateMachine as level9StateMachine } from '@/machines/level9/state-machine';

export type AnyLevelMachine =
  | typeof level1StateMachine
  | typeof level2StateMachine
  | typeof level3StateMachine
  | typeof level4StateMachine
  | typeof level5StateMachine
  | typeof leve6StateMachine
  | typeof level7StateMachine
  | typeof level8StateMachine
  | typeof level9StateMachine
  | typeof level10StateMachine
  | typeof level11StateMachine
  | typeof level12StateMachine;

const MACHINES: Record<number, AnyLevelMachine> = {
  1: level1StateMachine,
  2: level2StateMachine,
  3: level3StateMachine,
  4: level4StateMachine,
  5: level5StateMachine,
  6: leve6StateMachine,
  7: level7StateMachine,
  8: level8StateMachine,
  9: level9StateMachine,
  10: level10StateMachine,
  11: level11StateMachine,
  12: level12StateMachine,
};

// const cache: Partial<Record<number, ReturnType<typeof createActorContext<AnyLevelMachine>>>> = {};
// Creating and using the context must be done separately from the provider.
// Otherwise, HMR breaks with a null context value, causing consumers to reference
// a previous context value that is no longer present in the upstream provider.
// The exact reason for this behavior is still unclear to me. See: https://github.com/vitejs/vite/issues/3301
export const CurrentActorContext = createContext<ReturnType<typeof getActorContext> | null>(null);

export function getActorContext(
  level: number,
  snapshot?: Snapshot<unknown>
): ReturnType<typeof createActorContext<AnyLevelMachine>> {
  return createActorContext(MACHINES[level], { snapshot: snapshot });
}

export function LevelsProgressionContext(): ReturnType<typeof getActorContext> {
  const ctx = useContext(CurrentActorContext);
  if (!ctx) {
    throw new Error('useLevelsProgressionContext must be used within a LevelsProgressionProvider');
  }
  return ctx;
}
