import { FixedPopoverMessage } from '@/machines/types';

const FIXED_POPOVER_MSG1 = `
  The user node \`satoru\` has 2 tags attached to it:
  - \`grade:Special\`
  - \`ability:Limitless\`

  Remember, tags are key-value pairs which can be customized to anything you want.
`;

const FIXED_POPOVER_MSG2 = `
  What we ultimately want to achieve is to block access to secrets
  from any junior developer in the Staging Account,

`;

const FIXED_POPOVER_MSG3 = `
  How do we know that a user is a junior developer?
  By checking if their username starts with \`junior-\`

  Not ideal, but it works for now.
`;

export const FIXED_POPOVER_MESSAGES: FixedPopoverMessage[] = [
  {
    popover_title: "Let's place some guard rails",
    popover_content: FIXED_POPOVER_MSG1,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
  {
    popover_title: 'Removing sensitive access',
    popover_content: FIXED_POPOVER_MSG2,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
  {
    popover_title: 'Removing sensitive access',
    popover_content: FIXED_POPOVER_MSG3,
    position: 'top-left',
    show_close_button: false,
    show_next_button: true,
  },
];
