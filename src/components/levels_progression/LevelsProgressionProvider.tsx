import { createActorContext } from '@xstate/react';

import { stateMachine } from '@/machines/level1/state-machine';

// TODO: Fetch progressed to level number from local storage and set it as initial state
// Should we use xstate stores for providing the level's global state instead?
export const LevelsProgressionContext = createActorContext(stateMachine);
interface LevelsProgressionProviderProps {
  children: React.ReactNode;
}

const LevelsProgressionProvider: React.FC<LevelsProgressionProviderProps> = ({ children }) => {
  return <LevelsProgressionContext.Provider>{children}</LevelsProgressionContext.Provider>;
};

export default LevelsProgressionProvider;
