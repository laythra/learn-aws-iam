import { UserNodeID } from '../types/node-id-enums';
import type { PopoverTutorialMessage } from '@/machines/types/tutorial-message-types';

const POPOVER_MSG1 = `
  The user **omar** now has *read access* to the \`finance-reports\` DynamoDB table.
  And we never had to create a user in our own account. 🚀
`;

export const POPOVER_TUTORIAL_MESSAGES: PopoverTutorialMessage[] = [
  {
    element_id: UserNodeID.TrustedAccountIAMUser,
    popover_title: 'Cross-account access established 🚀',
    popover_content: POPOVER_MSG1,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
];
