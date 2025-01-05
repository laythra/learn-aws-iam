import { UserNodeID } from '../types/node-id-enums';
import type { PopoverTutorialMessage } from '@/machines/types';

export const POPOVER_TUTORIAL_MESSAGES: PopoverTutorialMessage[] = [
  {
    element_id: UserNodeID.OriginatingAccountAuditorUser,
    popover_title: 'Cross Account Access Established 🚀',
    popover_content: `
      The IAM User "richard" now has read access to the DynamoDB table "FinanceReports".
      We didn't need to create a new IAM user in our account for this to happen
    `,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
];
