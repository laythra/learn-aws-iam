import { createActorContext } from '@xstate/react';
import { ActorRefFrom } from 'xstate';

import { stateMachine as level1StateMachine } from '@/machines/level1/state-machine';
import { FinishEventMap as Level1FinishEventMap } from '@/machines/level1/types/finish-event-enums';
import { LevelObjectiveID as Level1ObjectiveID } from '@/machines/level1/types/objective-enums';
import { stateMachine as level2StateMachine } from '@/machines/level2/state-machine';
import { FinishEventMap as Level2FinishEventMap } from '@/machines/level2/types/finish-event-enums';
import { LevelObjectiveID as Level2ObjectiveID } from '@/machines/level2/types/objective-enums';
import { stateMachine as level3StateMachine } from '@/machines/level3/state-machine';
import { FinishEventMap as Level3FinishEventMap } from '@/machines/level3/types/finish-event-enums';
import { LevelObjectiveID as Level3ObjectiveID } from '@/machines/level3/types/objective-enums';
import { stateMachine as level4StateMachine } from '@/machines/level4/state-machine';
import { FinishEventMap as Level4FinishEventMap } from '@/machines/level4/types/finish-event-enums';
import { LevelObjectiveID as Level4ObjectiveID } from '@/machines/level4/types/objective-enums';
import { GenericContext } from '@/machines/types';

const LEVELS_STATE_MACHINES = {
  1: level1StateMachine,
  2: level2StateMachine,
  3: level3StateMachine,
  4: level4StateMachine,
};

const currentLevelNumber = parseInt(
  '2'
  // storage.getKey('current_level_number', '2')
) as keyof typeof LEVELS_STATE_MACHINES;

export const currentLevelStateMachine = LEVELS_STATE_MACHINES[currentLevelNumber];

export const LevelsProgressionContext =
  createActorContext<typeof currentLevelStateMachine>(currentLevelStateMachine);

interface LevelsProgressionProviderProps {
  children: React.ReactNode;
}

const LevelsProgressionProvider: React.FC<LevelsProgressionProviderProps> = ({ children }) => {
  return <LevelsProgressionContext.Provider>{children}</LevelsProgressionContext.Provider>;
};

export default LevelsProgressionProvider;
