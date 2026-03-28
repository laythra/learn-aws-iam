import { useEffect, useState } from 'react';

import { Center, Spinner } from '@chakra-ui/react';
import { useSelector } from '@xstate/store-react';
import isEqual from 'lodash/isEqual';

import { CurrentActorContext, loadLevelMachine, LevelActorContext } from './level-runtime';
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
  const [error, setError] = useState<Error | null>(null);
  if (error) throw error;

  useEffect(() => {
    let mounted = true;
    setActorCtx(null);
    const snapshot = loadCheckpoint(levelNumber);

    loadLevelMachine(levelNumber, snapshot)
      .then(ctx => {
        if (mounted) {
          setActorCtx(ctx);
        }
      })
      .catch(err => {
        if (mounted) setError(err);
      });

    return () => {
      mounted = false;
    };
  }, [levelNumber, restartKey]);

  if (!ActorCtx) {
    return (
      <Center h='100vh'>
        <Spinner size='xl' />
      </Center>
    );
  }

  return (
    <CurrentActorContext.Provider value={ActorCtx}>
      <ActorCtx.Provider>{children}</ActorCtx.Provider>
    </CurrentActorContext.Provider>
  );
};

export default LevelsProgressionProvider;
