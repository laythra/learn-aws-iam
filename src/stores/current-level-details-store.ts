import { createStore } from '@xstate/store';

type CurrentLevelDetailsState = {
  levelNumber: number;
};

type CurrentLevelDetailsEvents = {
  setLevelNumber: { levelNumber: number };
};

/*
 * A simple store that holds the current information about the level the user is currently on.
 * Currently only holds the level number.
 * Each level's state machine is responsible for updating this store when the level is completed.
 */

export default createStore<CurrentLevelDetailsState, CurrentLevelDetailsEvents>(
  {
    levelNumber: 1,
  },
  {
    setLevelNumber: (_context: CurrentLevelDetailsState, event: { levelNumber: number }) => ({
      levelNumber: event.levelNumber,
    }),
  }
);
