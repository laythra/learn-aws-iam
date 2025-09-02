import { createStore } from '@xstate/store';
import serialize from 'serialize-javascript';
import { Actor, AnyActorLogic } from 'xstate';

import storage from '@/utils/storage';

type CurrentLevelDetailsState = {
  levelNumber: number;
  reloadCount: number;
};

type CurrentLevelDetailsEvents = {
  setLevelNumber: { levelNumber: number };
  incrementLevelNumber: unknown;
  storeLevelProgress: { actor: Actor<AnyActorLogic> };
  storeSnapshotAtDisk: { actor: Actor<AnyActorLogic>; filename: string };
  returnToLastCheckpoint: unknown;
};

/*
 * A simple store that holds the current information about the level the user is currently on.
 * Currently only holds the level number.
 * Each level's state machine is responsible for updating this store when the level is completed.
 */

export default createStore<CurrentLevelDetailsState, CurrentLevelDetailsEvents>(
  {
    levelNumber: storage.getKey('currentLevel') ? parseInt(storage.getKey('currentLevel')!) : 1,
    reloadCount: 0,
  },
  {
    setLevelNumber: (context: CurrentLevelDetailsState, event: { levelNumber: number }) => {
      storage.setKey('currentLevel', event.levelNumber.toString());
      return { ...context, levelNumber: event.levelNumber };
    },
    incrementLevelNumber: (context: CurrentLevelDetailsState) => {
      const nextLevel = context.levelNumber + 1;
      storage.setKey('currentLevel', nextLevel.toString());
      return { levelNumber: nextLevel };
    },
    storeLevelProgress: (context: CurrentLevelDetailsState, event) => {
      storage.setKey(
        `level${context.levelNumber}StateCheckpoint`,
        serialize(event.actor.getPersistedSnapshot())
      );

      return context;
    },
    returnToLastCheckpoint: (context: CurrentLevelDetailsState) => {
      return { ...context, reloadCount: context.reloadCount + 1 };
    },
    // TODO: Remove this! Only used for testing and debugging purposes.
    storeSnapshotAtDisk: (context: CurrentLevelDetailsState, event) => {
      const snapshot = event.actor.getPersistedSnapshot();
      const snapshotString = serialize(snapshot);

      storage.setKey(`level${context.levelNumber}StateCheckpoint`, snapshotString);

      fetch('http://localhost:3001/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: snapshotString,
          filename: event.filename,
        }),
      });

      return context;
    },
  }
);
