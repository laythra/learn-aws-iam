import { useEffect, useMemo, useRef } from 'react';

import { useSelector } from '@xstate/store/react';
import _ from 'lodash';
import { Snapshot } from 'xstate';

import { CurrentActorContext, getActorContext } from './level-actor-contexts';
import CurrentLevelDetailsStore from '@/stores/current-level-details-store';
import storage from '@/utils/storage';

interface LevelsProgressionProviderProps {
  children: React.ReactNode;
}

const LevelsProgressionProvider: React.FC<LevelsProgressionProviderProps> = ({ children }) => {
  const [levelNumber] = useSelector(
    CurrentLevelDetailsStore,
    s => [s.context.levelNumber, s.context.reloadCount],
    _.isEqual
  );

  const snapshotRef = useRef<Record<number, Snapshot<unknown> | undefined>>({});

  if (!(levelNumber in snapshotRef.current)) {
    const raw = storage.getKey(`level${levelNumber}StateCheckpoint`);
    try {
      // eslint-disable-next-line no-eval
      snapshotRef.current[levelNumber] = raw ? eval('(' + raw + ')') : undefined;
    } catch {
      snapshotRef.current[levelNumber] = undefined;
    }
  }

  const ActorCtx = useMemo(
    () => getActorContext(levelNumber, snapshotRef.current[levelNumber]),
    [levelNumber]
  );

  useEffect(() => {
    delete snapshotRef.current[levelNumber];
  }, [levelNumber]);

  return (
    <CurrentActorContext.Provider value={ActorCtx}>
      <ActorCtx.Provider>{children}</ActorCtx.Provider>
    </CurrentActorContext.Provider>
  );
};

// Temporary backwards compatibility (optional)
// export const LevelsProgressionContext = useLevelsProgressionContext;

export default LevelsProgressionProvider;
