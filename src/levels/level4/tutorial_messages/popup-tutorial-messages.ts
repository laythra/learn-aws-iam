import type { PopupTutorialMessage } from '@/types/tutorial-message-types';

const POPUP_MSG_1 = `
You are the IAM Security Specialist at **TimeShift Labs** —
a company that handles sensitive customer data with strict compliance requirements.

**TimeShift Labs** uses the following AWS services:
* **DynamoDB** — Stores customer and analytics data
* **S3** — Stores public assets and private database backups
`;

const POPUP_MSG_2 = `
  In this level, you audited and fixed policies in an existing setup
  to ensure the **IAM policies** were correctly configured.

  By now, you should have a solid understanding of how to create and edit
  **IAM policies** to meet your organization's access requirements.

  In the next level, we'll explore **IAM Roles** and how they differ from users and groups.
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
