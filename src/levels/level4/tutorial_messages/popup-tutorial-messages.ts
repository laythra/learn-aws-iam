import type { PopupTutorialMessage } from '@/levels/types/tutorial-message-types';

const POPUP_MSG_1 = `
You are the IAM Security Specialist at *TimeShift Labs*,
a company that handles sensitive customer data and has strict compliance requirements.|lg

&nbsp;

*TimeShift Labs* uses the following services from AWS:|lg
* **DynamoDB** - To store customer and analytics data
* **S3** - To store public assets and DB backups
`;

const POPUP_MSG_2 = `
  In this level, you edited a bunch of policies in an existing setup
  to ensure that the **IAM policies** are set up correctly|lg

  Hopefully by now, you should have a good understanding of how to create and edit
  **IAM policies** to meet the requirements of your organization.|lg

  In the upcoming level, we will explore a n
`;

export const POPUP_TUTORIAL_MESSAGES: PopupTutorialMessage[] = [
  {
    title: 'Your Task as an IAM specialist',
    content: POPUP_MSG_1,
  },
  {
    title: 'Level Finished 🔥',
    content: POPUP_MSG_2,
    go_to_next_level_button: true,
  },
];
