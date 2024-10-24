import type { PopupTutorialMessage } from '@/machines/types';

const POPUP_MSG_1 = `
You are the IAM Security Specialist at *TimeShift Labs*,
a company that handles sensitive customer data and has strict compliance requirements.|lg

&nbsp;

*TimeShift Labs* uses the following services from AWS:|lg
* **DynamoDB** - To store customer and analytics data
* **S3** - To store public assets and DB backups
`;

const POPUP_MSG_2 = `
*TimeShift Labs* has recently discovered that some users have access to data and services
beyond what is necessary for their roles. This over-permission is not immediately obvious and stems
from subtle misconfigurations in their \`IAM policies\`.|lg
`;

const POPUP_MSG_3 = `
Luckily, *TimeShift Labs* has a very simple technical hierarchy:|lg
* **Developers** - Who should only have read access (GetItem)
to the \`AnalyticsData\` table inside DynamoDB and no access to \`CustomerData\` table.
* **Data Scientists** - Who should only be able to read/write objects
from/to \`timeshift-assets\` S3 Bucket
* **Interns** - Who should be able to read objects from the \`timeshift-assets\` S3 Bucket.
`;

const POPUP_MSG_4 = `
You will presented with *TimeShift Labs*' current IAM setup, which includes their current:
\`IAM Users\`, \`IAM Resources\`, and \`IAM Roles\`.|lg

&nbsp;

You are tasked with the following points:|lg
* Ensure no user has more permissions to their designated resources than necessary.
* Ensure no user has any sort of permission to resources they should not have access to.
`;

const POPUP_MSG_5 = `
As usual, you'll find the list of objectives in the right side panel. Good Luck! 💪 |lg
`;

export const POPUP_TUTORIAL_MESSAGES: PopupTutorialMessage[] = [
  {
    title: 'Your Task as an IAM specialist',
    content: POPUP_MSG_1,
  },
  {
    title: 'Your Task as an IAM specialist',
    content: POPUP_MSG_2,
  },
  {
    title: 'Your Task as an IAM specialist',
    content: POPUP_MSG_3,
  },
  {
    title: 'Your Task as an IAM specialist',
    content: POPUP_MSG_4,
  },
  {
    title: "You're on your own",
    content: POPUP_MSG_5,
  },
];
