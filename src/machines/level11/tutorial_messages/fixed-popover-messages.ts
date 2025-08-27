import { FixedPopoverMessage } from '@/machines/types';

const FIXED_POPOVER_MSG1 = `
  The currently attached permission boundary to Sephiroth caps his maximum permissions
  to listing SNS topics only. **Close this popover to continue.**
`;

const FIXED_POPOVER_MSG2 = `
  There you have it! 🎉

  Teams can now manage **ONLY** their own RDS instances by stopping and starting them,
  while the RDS instances of other teams remain untouched.

  All thanks to the power of *resource tags*, *request tags*, and *policy variables*,
  your team can now effectively manage resources in a multi-team environment.
`;

export const FIXED_POPOVER_MESSAGES: FixedPopoverMessage[] = [
  {
    popover_title: 'Permission Boundary Content',
    popover_content: FIXED_POPOVER_MSG1,
    position: 'top-left',
    show_close_button: false,
    show_next_button: false,
  },
  {
    popover_title: 'Team Management Complete',
    popover_content: FIXED_POPOVER_MSG2,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
];
