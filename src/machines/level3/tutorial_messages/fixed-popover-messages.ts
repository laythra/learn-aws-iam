import { FixedPopoverMessage } from '@/machines/types/tutorial-message-types';

const POPOVER_MSG1 = `
  What you're seeing is the **Policy's** statement,
  it's the core of the policy and it's represented in JSON format.

  Close the **Policy's** statement by clicking on the top right icon.
`;

const POPOVER_MSG2 = `
  Aside from the **Policy's** content, you can also view the **Policy's** **ARN** by clicking
  on the icon to the left of the content icon.
`;

const POPOVER_MSG3 = `
  You might be wondering, what is an **ARN**?
  Simply put, an **ARN** is a unique identifier used to
  distinguish an AWS resource across the entire AWS ecosystem.

  e.g. \`arn:aws:iam::123456789012:policy/my-policy\`
`;

const POPOVER_MSG4 = `
  It's not exclusive to **IAM**; rather,
  it's an AWS-wide concept used to identify and reference resources.
`;

const POPOVER_MSG5 = `
  You nailed it. Developers from both departments
  have their correct permissions properly setup,
  but watch out for unnecessary permissions or users 👀.
`;

export const FIXED_POPOVER_MESSAGES: FixedPopoverMessage[] = [
  {
    popover_title: 'The Policy Statement',
    popover_content: POPOVER_MSG1,
    position: 'top-left',
    show_close_button: false,
    show_next_button: false,
  },
  {
    popover_title: 'ARNs',
    popover_content: POPOVER_MSG2,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
  {
    popover_title: 'ARNs',
    popover_content: POPOVER_MSG3,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
  {
    popover_title: 'ARNs',
    popover_content: POPOVER_MSG4,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
  {
    popover_title: 'Access Granted 🔥',
    popover_content: POPOVER_MSG5,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
];
