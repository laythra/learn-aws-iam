import { createActorContext } from '@xstate/react';
import { useSelector } from '@xstate/store/react';
import _ from 'lodash';

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

type LevelNumber = keyof typeof LEVELS_STATE_MACHINES;
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

export const levelActors: {
  [key: number]: ReturnType<typeof createActorContext<ActorLogicType>>;
} = _.reduce(
  LEVELS_STATE_MACHINES,
  (acc, stateMachine, levelNumber) => ({
    ...acc,
    [levelNumber]: createActorContext(stateMachine),
  }),
  {}
);

interface LevelsProgressionProviderProps {
  children: React.ReactNode;
}

const LevelsProgressionProvider: React.FC<LevelsProgressionProviderProps> = ({ children }) => {
  const currentLevelNumber = useSelector(
    CurrentLevelDetailsStore,
    state => state.context.levelNumber
  );

  const TargetActor = levelActors[currentLevelNumber];

  return <TargetActor.Provider>{children}</TargetActor.Provider>;
};

export const LevelsProgressionContext = (): ReturnType<
  typeof createActorContext<ActorLogicType>
> => {
  const levelNumber = CurrentLevelDetailsStore.getSnapshot().context.levelNumber;
  return levelActors[levelNumber];
};
type LevelStateMachineType = (typeof LEVELS_STATE_MACHINES)[keyof typeof LEVELS_STATE_MACHINES];

export const getCurrentLevelStateMachine = (): LevelStateMachineType => {
  const levelNumber = CurrentLevelDetailsStore.getSnapshot().context.levelNumber as LevelNumber;
  return LEVELS_STATE_MACHINES[levelNumber];
};

export default LevelsProgressionProvider;
