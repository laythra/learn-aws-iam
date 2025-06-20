import { createContext, useContext } from 'react';

import { createActorContext } from '@xstate/react';
import { useSelector } from '@xstate/store/react';

import { stateMachine as level1StateMachine } from '@/machines/level1/state-machine';
import { stateMachine as level2StateMachine } from '@/machines/level2/state-machine';
import { stateMachine as level3StateMachine } from '@/machines/level3/state-machine';
import { stateMachine as level4StateMachine } from '@/machines/level4/state-machine';
import { stateMachine as level5StateMachine } from '@/machines/level5/state-machine';
import { stateMachine as leve6StateMachine } from '@/machines/level6/state-machine';
import { stateMachine as level7StateMachine } from '@/machines/level7/state-machine';
import { stateMachine as level8StateMachine } from '@/machines/level8/state-machine';
import { stateMachine as level9StateMachine } from '@/machines/level9/state-machine';
import CurrentLevelDetailsStore from '@/stores/current-level-details-store';
import storage from '@/utils/storage';

const CurrentActorContext = createContext<ReturnType<
  typeof createActorContext<ActorLogicType>
> | null>(null);

const LEVELS_STATE_MACHINES = {
  1: level1StateMachine,
  2: level2StateMachine,
  3: level3StateMachine,
  4: level4StateMachine,
  5: level5StateMachine,
  6: leve6StateMachine,
  7: level7StateMachine,
  8: level8StateMachine,
  9: level9StateMachine,
};

type ActorLogicType =
  | typeof level1StateMachine
  | typeof level2StateMachine
  | typeof level3StateMachine
  | typeof level4StateMachine
  | typeof level5StateMachine
  | typeof leve6StateMachine
  | typeof level7StateMachine
  | typeof level8StateMachine
  | typeof level9StateMachine;

const GetActorLogicFromLevelNumber = (
  levelNumber: keyof typeof LEVELS_STATE_MACHINES
): ReturnType<typeof createActorContext<ActorLogicType>> => {
  const stateMachine = LEVELS_STATE_MACHINES[levelNumber];
  const checkpointData = storage.getKey(`level${levelNumber}StateCheckpoint`);

  return createActorContext(stateMachine, {
    snapshot: checkpointData ? JSON.parse(checkpointData) : undefined,
  });
};

interface LevelsProgressionProviderProps {
  children: React.ReactNode;
}

const LevelsProgressionProvider: React.FC<LevelsProgressionProviderProps> = ({ children }) => {
  const currentLevelNumber = useSelector(
    CurrentLevelDetailsStore,
    state => state.context.levelNumber
  ) as keyof typeof LEVELS_STATE_MACHINES;

  const ActorLogic = GetActorLogicFromLevelNumber(currentLevelNumber);

  return (
    <CurrentActorContext.Provider value={ActorLogic}>
      <ActorLogic.Provider>{children}</ActorLogic.Provider>
    </CurrentActorContext.Provider>
  );
};

/**
 * Retrieves the context for the current level's actor logic.
 * @returns The context for the current level's actor logic.
 */
export const LevelsProgressionContext = (): ReturnType<
  typeof createActorContext<ActorLogicType>
> => {
  const actorContext = useContext(CurrentActorContext);

  if (!actorContext) {
    throw new Error('LevelsProgressionContext must be used within a LevelsProgressionProvider');
  }

  return actorContext;
};

export default LevelsProgressionProvider;
