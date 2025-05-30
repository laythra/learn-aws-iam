import { FixedPopoverMessage } from '@/machines/types';

const FIXED_POPOVER_MSG1 = `
  Laith is a user in the Development Account who was mistakenly
  given access to sensitive integration secrets via the secrets-read-access policy.
  However, organizational governance has decided that no user should access
  secrets directly without security team oversight.
  So, an SCP should be created to restrict secrets access
  for the entire Organizational Unit that contains this account
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
