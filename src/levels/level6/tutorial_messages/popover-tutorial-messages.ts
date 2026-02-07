import { UserNodeID } from '../types/node-id-enums';
import type { PopoverTutorialMessage } from '@/levels/types/tutorial-message-types';

const POPOVER_MSG1 = `
  The IAM User "omar" now has *read access* to the DynamoDB table \`finance-reports\`.
  We didn't need to create a new IAM user in our account for this to happen 🚀
`;

export const POPOVER_TUTORIAL_MESSAGES: PopoverTutorialMessage[] = [
  {
    element_id: UserNodeID.TrustedAccountIAMUser,
    popover_title: 'Cross Account Access Established 🚀',
    popover_content: POPOVER_MSG1,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
];
