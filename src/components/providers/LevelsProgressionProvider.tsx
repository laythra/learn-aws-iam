import { createActorContext } from '@xstate/react';

import { stateMachine as level1StateMachine } from '@/machines/level1/state-machine';
import { stateMachine as level2StateMachine } from '@/machines/level2/state-machine';
import { stateMachine as level3StateMachine } from '@/machines/level3/state-machine';

const LEVELS_STATE_MACHINES = {
  1: level1StateMachine,
  2: level2StateMachine,
  3: level3StateMachine,
};

const currentLevelNumber = parseInt(
  '3'
  // storage.getKey('current_level_number', '2')
) as keyof typeof LEVELS_STATE_MACHINES;

const currentLevelStateMachine = LEVELS_STATE_MACHINES[currentLevelNumber];

export const LevelsProgressionContext = createActorContext(currentLevelStateMachine);

interface LevelsProgressionProviderProps {
  children: React.ReactNode;
}

const LevelsProgressionProvider: React.FC<LevelsProgressionProviderProps> = ({ children }) => {
  return <LevelsProgressionContext.Provider>{children}</LevelsProgressionContext.Provider>;
};

export default LevelsProgressionProvider;
