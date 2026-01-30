import { createStore } from '@xstate/store';

type LevelDetailsState = {
  levelNumber: number;
  restartKey: number; // Add restart counter to state
  maxLevelReached: number;
};

type LevelDetailsEvent =
  | { type: 'setLevelNumber'; levelNumber: number }
  | { type: 'initialize'; levelNumber: number; maxLevelReached: number }
  | { type: 'incrementLevelNumber' }
  | { type: 'returnToLastCheckpoint' }
  | { type: 'restartLevel' }
  | { type: 'setMaxLevelReached'; maxLevelReached: number };

export const LevelDetailsStore = createStore<LevelDetailsState, LevelDetailsEvent, never>({
  context: {
    levelNumber: 1,
    maxLevelReached: 1,
    // Restart key is used to force reloading the level actor
    restartKey: 0,
  },
  on: {
    setLevelNumber: (context, event) => ({
      ...context,
      levelNumber: event.levelNumber,
      restartKey: context.restartKey + 1,
    }),
    incrementLevelNumber: context => ({
      ...context,
      levelNumber: context.levelNumber + 1,
      restartKey: context.restartKey + 1,
    }),
    returnToLastCheckpoint: context => ({
      ...context,
      restartKey: context.restartKey + 1,
    }),
    restartLevel: context => ({
      ...context,
      restartKey: context.restartKey + 1,
    }),
    initialize: (context, event) => ({
      ...context,
      levelNumber: event.levelNumber,
      maxLevelReached: event.maxLevelReached,
    }),
    setMaxLevelReached: (context, event) => ({
      ...context,
      maxLevelReached: event.maxLevelReached,
    }),
  },
});
