import type { PopupTutorialMessage } from '@/machines/types/tutorial-message-types';

const POPUP_MSG_1 = `
You’re the IAM Security Specialist at *TimeShift Labs*—
strict compliance, sensitive data, the works.|lg

*TimeShift Labs* uses:|lg
* **DynamoDB** for customer + analytics data
* **S3** for public assets and DB backups
`;

const POPUP_MSG_2 = `
  You just cleaned up a messy policy setup and made sure access is correct.|lg

  By now you should feel comfortable creating and editing **IAM policies**
  to match real business needs.|lg

  Next level, we’ll keep building on that.
`;

export const POPUP_TUTORIAL_MESSAGES: PopupTutorialMessage[] = [
  {
    title: 'Your task as an IAM specialist',
    content: POPUP_MSG_1,
  },
  {
    title: 'Level finished 🔥',
    content: POPUP_MSG_2,
    go_to_next_level_button: true,
  },
];
