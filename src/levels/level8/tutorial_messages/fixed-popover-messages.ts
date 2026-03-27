import { FixedPopoverMessage } from '@/types/tutorial-message-types';

const FIXED_POPOVER_MSG1 = `
  Right now, one role allows users to deploy the Slack alerting service
  and read the Slack integration secret. That is not ideal.
  We only want ***Senior*** developers
  to view the token for debugging.

  How can we identify senior developers?
  ***For now, we'll explicitly list their ARNs in the policy condition***

  - \`junior-alex\` and \`junior-morgan\` are junior developers.
  - \`senior-sam\` and \`senior-jordan\` are senior developers.
`;

const FIXED_POPOVER_MSG2 = `
  Nice work. Now only senior developers can read the Slack integration secret.

  However, hardcoding ARNs is not ideal.
  Every time a developer joins or leaves the team,
  you'd need to manually update the policy.

  Next, we'll switch to **Tag-Based Access Control (TBAC)** for a more scalable approach.
`;

const FIXED_POPOVER_MSG3 = `
  You can view tags associated with an IAM entity by clicking on the tags \`::icon[TagIcon]::\`
  icon on the top-right of the node.
`;

const FIXED_POPOVER_MSG4 = `
  A tag in IAM is a key-value pair on an IAM entity
  (for example, a user or a role).

  This user has a \`role\` tag with a value of \`senior\` or \`junior\`.
  We'll use this tag to enforce better access control.

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
