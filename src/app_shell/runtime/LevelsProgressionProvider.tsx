import { useSelector } from '@xstate/store/react';
import _ from 'lodash';

import { CurrentActorContext, getActorContext } from './levelRuntime';
import { loadCheckpoint } from '@/app_shell/runtime/level-persistence';
import { LevelDetailsStore } from '@/app_shell/runtime/level-store';

interface LevelsProgressionProviderProps {
  children: React.ReactNode;
}

const LevelsProgressionProvider: React.FC<LevelsProgressionProviderProps> = ({ children }) => {
  // Restart key is used to force reloading the level actor when level is restarted or changed
  const [levelNumber, _restartKey] = useSelector(
    LevelDetailsStore,
    s => [s.context.levelNumber, s.context.restartKey],
    _.isEqual
  );

  const snapshot = loadCheckpoint(levelNumber);
  const ActorCtx = getActorContext(levelNumber, snapshot);

  return (
    <CurrentActorContext.Provider value={ActorCtx}>
      <ActorCtx.Provider>{children}</ActorCtx.Provider>
    </CurrentActorContext.Provider>
  );
};

export default LevelsProgressionProvider;
