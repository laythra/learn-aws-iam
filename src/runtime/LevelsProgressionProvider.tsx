import { useEffect, useState } from 'react';

import { useSelector } from '@xstate/store-react';
import isEqual from 'lodash/isEqual';

import { CurrentActorContext, getActorContext, LevelActorContext } from './level-runtime';
import { loadCheckpoint } from '@/runtime/level-persistence';
import { LevelDetailsStore } from '@/runtime/level-store';

interface LevelsProgressionProviderProps {
  children: React.ReactNode;
}

const LevelsProgressionProvider: React.FC<LevelsProgressionProviderProps> = ({ children }) => {
  // Restart key is used to force reloading the level actor when level is restarted or changed
  const [levelNumber, restartKey] = useSelector(
    LevelDetailsStore,
    s => [s.context.levelNumber, s.context.restartKey],
    isEqual
  );

  const [ActorCtx, setActorCtx] = useState<LevelActorContext | null>(null);

  useEffect(() => {
    setActorCtx(null); // Clear previous actor context while loading new one
    const snapshot = loadCheckpoint(levelNumber);
    setActorCtx(getActorContext(levelNumber, snapshot));
  }, [levelNumber, restartKey]);

  if (!ActorCtx) {
    return null;
  }

  return (
    <CurrentActorContext.Provider value={ActorCtx}>
      <ActorCtx.Provider>{children}</ActorCtx.Provider>
    </CurrentActorContext.Provider>
  );
};

export default LevelsProgressionProvider;
