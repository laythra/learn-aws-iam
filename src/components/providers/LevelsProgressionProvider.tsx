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

  const snapshotRaw = storage.getKey(`level${levelNumber}StateCheckpoint`);
  let snapshot: Snapshot<unknown> | undefined = undefined;

  try {
    snapshot = snapshotRaw ? JSON.parse(snapshotRaw) : undefined;
  } catch {
    snapshot = undefined;
  }

  const ActorCtx = getActorContext(levelNumber, snapshot);

  return (
    <CurrentActorContext.Provider value={ActorCtx}>
      <ActorCtx.Provider>{children}</ActorCtx.Provider>
    </CurrentActorContext.Provider>
  );
};

export default LevelsProgressionProvider;
