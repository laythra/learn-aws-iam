import { FixedPopoverMessage } from '@/machines/types/tutorial-message-types';

const FIXED_POPOVER_MSG1 = `
  Right now, the same role lets users deploy the Slack Crashlytics Notifier
  **and** read the Slack Integration Secret. That’s too broad.

  We only want **senior** devs to see the token.

  One quick way: check if the username starts with \`senior-\`.
`;

const FIXED_POPOVER_MSG2 = `
  Nice—only senior devs can read the secret now.

  But username matching is brittle. If someone’s role changes,
  you’re stuck because IAM usernames don’t change.

  That’s why we’ll switch to **Tag-Based Access Control (TBAC)**.
`;

const FIXED_POPOVER_MSG3 = `
  View tags by clicking the :icon[TagIcon]: icon on the top-right of a node.
`;

const FIXED_POPOVER_MSG4 = `
  An IAM tag is a key/value pair on a user, role, or policy.
  Great for organizing and controlling access.

  The tag here uses \`role\` with values like \`senior\` or \`junior\`.

  **Close this popover to keep editing the policy.**
`;

export const FIXED_POPOVER_MESSAGES: FixedPopoverMessage[] = [
  {
    popover_title: 'Applying conditional access',
    popover_content: FIXED_POPOVER_MSG1,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
  {
    popover_title: 'Applying conditional access',
    popover_content: FIXED_POPOVER_MSG2,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
  {
    popover_title: 'Applying conditional access',
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
