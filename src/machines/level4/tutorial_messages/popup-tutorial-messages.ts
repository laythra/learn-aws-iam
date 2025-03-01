import type { PopupTutorialMessage } from '@/machines/types';

const POPUP_MSG_1 = `
You are the IAM Security Specialist at *TimeShift Labs*,
a company that handles sensitive customer data and has strict compliance requirements.|lg

&nbsp;

*TimeShift Labs* uses the following services from AWS:|lg
* **DynamoDB** - To store customer and analytics data
* **S3** - To store public assets and DB backups
`;

export const POPUP_TUTORIAL_MESSAGES: PopupTutorialMessage[] = [
  {
    title: 'Your Task as an IAM specialist',
    content: POPUP_MSG_1,
  },
];
