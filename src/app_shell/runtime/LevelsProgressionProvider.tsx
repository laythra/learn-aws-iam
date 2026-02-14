import { useEffect, useState } from 'react';

import { useSelector } from '@xstate/store/react';
import isEqual from 'lodash/isEqual';

import { CurrentActorContext, getActorContextAsync, LevelActorContext } from './level-runtime';
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
    isEqual
  );

  const [ActorCtx, setActorCtx] = useState<LevelActorContext | null>(null);

  useEffect(() => {
    let mounted = true;
    const snapshot = loadCheckpoint(levelNumber);

    getActorContextAsync(levelNumber, snapshot).then(ctx => {
      if (mounted) {
        setActorCtx(ctx);
      }
    });

    return () => {
      mounted = false;
    };
  }, [levelNumber, _restartKey]);

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
