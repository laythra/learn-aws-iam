import { FixedPopoverMessage } from '@/machines/types/tutorial-message-types';

const FIXED_POPOVER_MSG1 = `
  The default SCP allows everything—but that doesn’t override IAM policies.

  Effective permissions = **SCP allows** ∩ **IAM allows**.

  **Close this popover to continue.**
`;

const FIXED_POPOVER_MSG2 = `
  Nice. CloudTrail is now protected from deletion.
  The SCP denies \`cloudtrail:DeleteTrail\`, and the effective permissions
  are still the intersection of SCP and IAM policies. 🫡
`;

export const FIXED_POPOVER_MESSAGES: FixedPopoverMessage[] = [
  {
    popover_title: 'SCP content',
    popover_content: FIXED_POPOVER_MSG1,
    position: 'top-left',
    show_close_button: false,
    show_next_button: false,
  },
  {
    popover_title: 'SCP content',
    popover_content: FIXED_POPOVER_MSG2,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
];
