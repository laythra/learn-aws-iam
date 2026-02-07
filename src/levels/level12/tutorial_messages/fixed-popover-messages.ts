import { FixedPopoverMessage } from '@/levels/types/tutorial-message-types';

const FIXED_POPOVER_MSG1 = `
  Notice that the SCP allows all actions by default.
  This surely doesn't mean that the accounts in this OU can do anything they want.

  Their IAM policies still apply, and the effective permissions are the intersection
  between what the SCP allows and what their IAM policies allow.

  ***Close the popover to continue.***
`;

const FIXED_POPOVER_MSG2 = `
  Nice job. Notice how the CloudTrail trail in the account is now protected from deletion.
  This is because the SCP you created denies the \`cloudtrail:DeleteTrail\` action,
  and the effective permissions are the intersection between what the SCP allows
  and what the account's IAM policies allow. 🫡
`;

export const FIXED_POPOVER_MESSAGES: FixedPopoverMessage[] = [
  {
    popover_title: 'SCP Content',
    popover_content: FIXED_POPOVER_MSG1,
    position: 'top-left',
    show_close_button: false,
    show_next_button: false,
  },
  {
    popover_title: 'SCP Content',
    popover_content: FIXED_POPOVER_MSG2,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
];
