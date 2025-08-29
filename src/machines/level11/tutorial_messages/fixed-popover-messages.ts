import { FixedPopoverMessage } from '@/machines/types';

const FIXED_POPOVER_MSG1 = `
  The currently attached permission boundary to Sephiroth caps his maximum permissions
  to listing SNS topics only. **Close this popover to continue.**
`;

const FIXED_POPOVER_MSG2 = `
  For this part of the level, you'll be an admin who wants to delegate permission management
  to the senior developer on your team in order to scale and move faster.

  This can happen by granting the senior developer *Cloud* permissions to:

  * Create a permission boundary which limits users
  to reading secrets tagged with their team name, ie: \`team: \${aws:PrincipalTag/team}\`
  * Allow users tagged with **"role:senior"** to create permission policies as they like
  * Allow the same users to attach these permission policies to roles that **ONLY**
    have the created permission boundary attached
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
