import { FixedPopoverMessage } from '@/types/tutorial-message-types';

const FIXED_POPOVER_MSG1 = `
  Right now, one role allows users to deploy the Slack alerting service
  and read the Slack integration secret. That is not ideal.
  We only want ***Senior*** developers
  to view the token for debugging.

  How can we identify senior developers?
  ***By checking whether their username starts with \`senior-\`.***
`;

const FIXED_POPOVER_MSG2 = `
  Nice work. Now only senior developers can read the Slack integration secret.

  However, matching usernames with wildcards is not ideal.
  If a user's role changes from junior to senior,
  this approach is cumbersome because IAM usernames are immutable.

  Next, we'll switch to **Tag-Based Access Control (TBAC)**.
`;

const FIXED_POPOVER_MSG3 = `
  You can view tags associated with an IAM entity by clicking on the tags \`::icon[TagIcon]::\`
  icon on the top-right of the node.
`;

const FIXED_POPOVER_MSG4 = `
  A tag in IAM is a key-value pair on an IAM entity
  (for example, a user or a role).

  This user has a \`role\` tag with a value of \`senior\` or \`junior\`.
  We'll use that with the condition key \`aws:PrincipalTag/role\`.

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
    tutorial_video: 'tags',
  },
  {
    popover_title: 'Tags in AWS 🏷️',
    popover_content: FIXED_POPOVER_MSG4,
    position: 'top-left',
    show_close_button: false,
    show_next_button: false,
  },
];
