import { FixedPopoverMessage } from '@/machines/types';

const POPUP_MSG1 = `
  What you're seeing os the **Policy's** statement,
  it's the core of the policy and it's represented in JSON format.

  Close the **Policy's** statement by clicking on the top right icon.
`;

const POPUP_MSG_1 = `
  Aside from the **Policy's** content, you can also view the **Policy's** ARN by clicking
  on the icon to the left of the content icon.
`;

const POPUP_MSG_2 = `
  You maybe wondering, what is an **ARN**?
  simply put, an **ARN** is a unique identifier for an **AWS resource**
  to identify a resource across all of AWS.

`;

const POPUP_MSG_3 = `
  It's not an execlusive **IAM** concept, but rather an AWS wide concept
  that is used to identify and reference resources.
`;

export const FIXED_POPOVER_MESSAGES: FixedPopoverMessage[] = [
  {
    popover_title: 'The Policy Statement',
    popover_content: POPUP_MSG1,
    position: 'top-left',
    show_close_button: false,
    show_next_button: false,
  },
  {
    popover_title: 'ARNs',
    popover_content: POPUP_MSG_1,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
  {
    popover_title: 'ARNs',
    popover_content: POPUP_MSG_2,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
  {
    popover_title: 'ARNs',
    popover_content: POPUP_MSG_3,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
];
