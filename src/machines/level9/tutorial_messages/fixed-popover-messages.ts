import { FixedPopoverMessage } from '@/machines/types';

const FIXED_POPOVER_MSG1 = `
  The Selected EC2 has the following tag:
  - \`CreatedBy:bond\`

  Remember, tags are key-value pairs which can be customized to anything you want.
  In this case, the tag indicates that the EC2 instance was created by a user named \`bond\`.

  &nbsp;

  Close the popover to continue.
`;

const FIXED_POPOVER_MSG2 = `
  The goal for this section is to create 1 **Permission Policy** which should allow
  the creator of the EC2 instance to terminate it, but block all other users from doing so.

  This will be acheivable using the \`Condition\` element in the policy.
`;

const FIXED_POPOVER_MSG3 = `
  Great Job! Notice how the users \`bond\` and \`james\`
  can now terminate the EC2 instances which they created,

  Some benefits of using tags in this way:
  - Enforces ownership without needing separate roles or manual tracking
  - Simplifies permissions management by using tags

  Click next to head to the next section of this level.
`;

export const FIXED_POPOVER_MESSAGES: FixedPopoverMessage[] = [
  {
    popover_title: 'Introduction to EC2 Instance Tags',
    popover_content: FIXED_POPOVER_MSG1,
    position: 'top-left',
    show_close_button: false,
    show_next_button: false,
  },
  {
    popover_title: 'Creating a Permission Policy',
    popover_content: FIXED_POPOVER_MSG2,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
  {
    popover_title: 'You did it! 🔥',
    popover_content: FIXED_POPOVER_MSG3,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
];
