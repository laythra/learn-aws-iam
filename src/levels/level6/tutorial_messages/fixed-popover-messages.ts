import { FixedPopoverMessage } from '@/types/tutorial-message-types';

const FIXED_POPOVER_MSG1 = `
  Complete the objectives in the right-side panel to establish cross-account access.

  Recommended sequence:
  1. Create an **IAM Role** with a trust policy that allows \`omar\` to use it.
  2. Create and attach a **DynamoDB read policy** to that role.
  3. Create a **Permission Policy** in the **Trusted Account**
  that allows \`omar\` to assume the role.
  4. Connect \`omar\` to the role to assume it.

  Use the objective **Hint** button whenever you're stuck.
`;

export const FIXED_POPOVER_MESSAGES: FixedPopoverMessage[] = [
  {
    popover_title: "This Level's Objective",
    popover_content: FIXED_POPOVER_MSG1,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
];
