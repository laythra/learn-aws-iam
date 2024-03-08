import { setup, assign } from 'xstate';

type updateLevelEvent = { level_description: string; level_title: string };

const levelProgressionMachine = setup({
  types: {} as {
    context: {
      level_title: string;
      level_description: string;
      level_number: number;
      total_levels: number;
    };
    events: { type: 'BEGIN' } | { type: 'COMPLETE' } | { type: 'NEXT' };
  },
  actions: {
    updateLevel: assign({
      level_description: (_, params: updateLevelEvent) => params.level_description,
      level_title: (_, params: updateLevelEvent) => params.level_title,
      level_number: ({ context }) => context.level_number + 1,
    }),
  },
}).createMachine({
  id: 'iamLevels',
  initial: 'level1',
  context: {
    level_title: 'IAM Basics',
    level_description: 'Learn about Identity and Access Management',
    level_number: 1,
    total_levels: 10,
  },
  states: {
    level1: {
      on: {
        NEXT: {
          target: 'level2',
          actions: {
            type: 'updateLevel',
            params: { level_description: 'Learn about IAM roles', level_title: 'IAM Roles' },
          },
        },
      },
    },
    level2: {
      on: { COMPLETE: 'completion' },
    },
    completion: {
      type: 'final',
    },
  },
});

export default levelProgressionMachine;
