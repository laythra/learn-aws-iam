import { FixedPopoverMessage } from '@/machines/types/tutorial-message-types';

const FIXED_POPOVER_MSG1 = `
  Phenomenal efforts so far! 🔥

  Notice the created RDS instances? They are tagged with the team name,
  which is essential for the next objective.

  One thing remains, we want to allow teams to manage their own RDS instances,
  but not the instances of other teams.

  Managing here means being able to stop/start the instance.
`;

const FIXED_POPOVER_MSG2 = `
  There you have it! 🎉

  Teams can now manage **ONLY** their own RDS instances by stopping and starting them,
  while the RDS instances of other teams remain untouched.

  All thanks to the power of *resource tags*, *request tags*, and *policy variables*,
  your team can now effectively manage resources in a multi-team environment.
`;

export const FIXED_POPOVER_MESSAGES: FixedPopoverMessage[] = [
  {
    popover_title: 'Nice Work!',
    popover_content: FIXED_POPOVER_MSG1,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
  {
    popover_title: 'Team Management Complete',
    popover_content: FIXED_POPOVER_MSG2,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
];
