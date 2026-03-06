import { FixedPopoverMessage } from '@/levels/types/tutorial-message-types';

const FIXED_POPOVER_MSG1 = `
  Phenomenal efforts so far! 🔥

  Notice the created RDS instances? They are tagged with the team name,
  which is essential for the next objective.

  One thing remains: we want to allow teams to manage their own RDS instances,
  but not the instances of other teams.

  Managing here means being able to stop and start the instance.
`;

const FIXED_POPOVER_MSG2 = `
  There you have it! 🎉

  Between *request tags* for enforcing tagging rules at creation time,
  and *resource tags* with *policy variables* for scoping access to the right instances,
  you've seen how tagging makes IAM policies scale cleanly across any number of teams.

  Even if a group contains users from different teams,
  the policy enforces that each user can only manage their own resources.
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
