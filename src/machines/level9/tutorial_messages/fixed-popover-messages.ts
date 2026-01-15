import { FixedPopoverMessage } from '@/machines/types/tutorial-message-types';

const FIXED_POPOVER_MSG1 = `
  You’ll see users attached to two groups (two teams).

  Each user and resource has an **application** tag. That tag links them
  to the app they work on.

  Take a minute to check those tags.
`;

const FIXED_POPOVER_MSG2 = `
  Goal: let users connect to **RDS instances** for *their* application.

  We’ll match the user’s **application** tag with the RDS instance’s
  **application** tag.
`;

const FIXED_POPOVER_MSG3 = `
  Nice work so far.

  Notice how similar the two policies are? Same actions/conditions, only the
  resource tag changes.

  That’s where **policy variables** come in—placeholders resolved at evaluation time.
`;

const FIXED_POPOVER_MSG4 = `
  We’ll replace the two policies with **one** policy using a variable.

  Use *\`aws:ResourceTag/application\`* to match the resource tag to
  the user’s **application** tag.
`;

const FIXED_POPOVER_MSG5 = `
  See how one policy works for both groups? That’s the power of variables.
`;

export const FIXED_POPOVER_MESSAGES: FixedPopoverMessage[] = [
  {
    popover_title: 'Understanding the environment',
    popover_content: FIXED_POPOVER_MSG1,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
  {
    popover_title: 'Objective overview',
    popover_content: FIXED_POPOVER_MSG2,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
  {
    popover_title: 'Using policy variables',
    popover_content: FIXED_POPOVER_MSG3,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
  {
    popover_title: 'Creating one policy with variables',
    popover_content: FIXED_POPOVER_MSG4,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
  {
    popover_title: 'One policy for both groups! 💪🏻',
    popover_content: FIXED_POPOVER_MSG5,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
];
