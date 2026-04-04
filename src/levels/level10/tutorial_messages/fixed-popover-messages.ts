import { FixedPopoverMessage } from '@/types/tutorial-message-types';

const FIXED_POPOVER_MSG1 = `
  Phenomenal efforts so far! 🔥

  These EC2 instances represent each team's compute resources, pre-tagged with the application name.
  That tag is what makes the next objective possible.

  One thing remains: allow each team to start and stop their own instances,
  but not those belonging to other teams.
`;

const FIXED_POPOVER_MSG2 = `
  There you have it! 🎉

  Every user is in the same **engineering** group,
  yet each team can only access their own instances.
  No per-team groups, no separate policies per team.

  Between **request tags** for enforcing tagging rules at launch time,
  and **resource tags** with **policy variables** for scoping access to the right instances,
  you've seen how tagging makes IAM policies scale cleanly across teams.

  Access is governed by the user's \`application\` tag, not the group they belong to.
  That's ABAC in action.
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
