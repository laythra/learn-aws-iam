import { FixedPopoverMessage } from '@/levels/types/tutorial-message-types';

const FIXED_POPOVER_MSG1 = `
  Currently, the same role is allowing users to deploy the Slack Crashlytics Notifier Service,
  as well as read the Slack Integration Secret. This is not ideal,
  as we'd like to only allow ***Senior*** developers
  to have visibility into the actual token for debugging purposes.”

  How can we know if a user is a senior developer?
  ***By checking if their username starts with \`senior-\`***
`;

const FIXED_POPOVER_MSG2 = `
  Good job, now only senior developers can read the Slack Integration Secret.

  However, using wildcards and matching usernames directly is not ideal.
  Suppose we want to change a user's role from junior to senior,
  this will be quite cumbersome to implement with the current setup. (IAM usernames are immutable)

  For this reason, we will be moving forward with **Tag Based Access Control (TBAC)**.
`;

const FIXED_POPOVER_MSG3 = `
  You can view tags associated with an IAM entity by clicking on the tags \`:icon[TagIcon]:\`
  icon on the top-right of the node.
`;

const FIXED_POPOVER_MSG4 = `
  a tag in IAM is a key-value pair that can be associated with an IAM entity,
  such as a user, role, or policy. Tags are used to organize and manage IAM entities,

  The tag you're currently viewing has a key of \`role\` and a value of \`senior\` or \`junior\`.

  **Close the popover to continue editing the policy.**
`;

export const FIXED_POPOVER_MESSAGES: FixedPopoverMessage[] = [
  {
    popover_title: 'Applying Conditional Access',
    popover_content: FIXED_POPOVER_MSG1,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
  {
    popover_title: 'Applying Conditional Access',
    popover_content: FIXED_POPOVER_MSG2,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
  {
    popover_title: 'Applying Conditional Access',
    popover_content: FIXED_POPOVER_MSG3,
    position: 'top-left',
    show_close_button: false,
    show_next_button: false,
    tutorial_gif: 'tags',
  },
  {
    popover_title: 'Tags in AWS 🏷️',
    popover_content: FIXED_POPOVER_MSG4,
    position: 'top-left',
    show_close_button: false,
    show_next_button: false,
  },
];
