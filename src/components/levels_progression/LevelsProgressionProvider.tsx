import { createActorContext } from '@xstate/react';

import levelProgressionMachine from '@/machines/levels-progression-machine';

export const LevelsProgressionContext = createActorContext(levelProgressionMachine);
interface LevelsProgressionProviderProps {
  children: React.ReactNode;
}

const LevelsProgressionProvider: React.FC<LevelsProgressionProviderProps> = ({ children }) => {
  return <LevelsProgressionContext.Provider>{children}</LevelsProgressionContext.Provider>;
};

export default LevelsProgressionProvider;
