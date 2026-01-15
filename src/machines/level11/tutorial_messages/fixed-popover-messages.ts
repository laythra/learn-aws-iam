import { FixedPopoverMessage } from '@/machines/types/tutorial-message-types';

const FIXED_POPOVER_MSG1 = `
  Sephiroth’s permission boundary caps him to **listing SNS topics only**.
  **Close this popover to continue.**
`;

const FIXED_POPOVER_MSG2 = `
  Almost there.

  Connect the nodes you created:

  * Permission boundary → role
  * Delegation policy → role
`;

const FIXED_POPOVER_MSG3 = `
  Nice job. Quick recap:

  * You created a boundary that limits secret reads to matching \`team\` tags.
  * You created a policy that allows attaching policies only to roles
    with that boundary.

  **Click \`Next\` to see it in action.**
`;

const FIXED_POPOVER_MSG4 = `
  Even with an admin policy attached, Tifa is still constrained by the boundary.

  And Cloud can only attach policies to roles that already have the boundary.

  That’s the power of permission boundaries. 🔥
`;

export const FIXED_POPOVER_MESSAGES: FixedPopoverMessage[] = [
  {
    popover_title: 'Permission boundary content',
    popover_content: FIXED_POPOVER_MSG1,
    position: 'top-left',
    show_close_button: false,
    show_next_button: false,
  },
  {
    popover_title: 'Connecting the nodes',
    popover_content: FIXED_POPOVER_MSG2,
    position: 'top-left',
    show_close_button: false,
    show_next_button: false,
  },
  {
    popover_title: "The connections you've made",
    popover_content: FIXED_POPOVER_MSG3,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
  {
    popover_title: 'The setup is complete',
    popover_content: FIXED_POPOVER_MSG4,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
];
