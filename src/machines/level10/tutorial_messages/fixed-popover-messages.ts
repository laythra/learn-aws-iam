import { FixedPopoverMessage } from '@/machines/types/tutorial-message-types';

const FIXED_POPOVER_MSG1 = `
  Great progress so far! 🔥

  See those RDS instances? They’re tagged with team names,
  which we’ll use in this next objective.

  Goal: teams can start/stop **their own** RDS instances,
  but not anyone else’s.
`;

const FIXED_POPOVER_MSG2 = `
  Nice! 🎉

  Teams can now manage only their own RDS instances.
  Tags and policy variables made that clean and scalable.
`;

export const FIXED_POPOVER_MESSAGES: FixedPopoverMessage[] = [
  {
    popover_title: 'Nice work!',
    popover_content: FIXED_POPOVER_MSG1,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
  {
    popover_title: 'Team management complete',
    popover_content: FIXED_POPOVER_MSG2,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
];
