import { PopupTutorialMessage } from '@/types/tutorial-message-types';
const POPUP_MSG1 = `
  **IAM Roles** are powerful in AWS.
  Beyond temporary credentials and service-to-service access,
  they are also a core mechanism for **cross-account access**.

  If you need to grant a third party access to resources in your account,
  roles let you do that without creating long-term users in your account.

  This challenge will test your understanding of how roles enable
  secure cross-account access.
`;

const POPUP_MSG2 = `
  Suppose your company stores financial data in a **DynamoDB table**
  named \`finance-reports\` in the **Trusting Account**.

  You hire a third-party auditor. Their identity is an **IAM User**
  named \`alex\` in a different AWS account (the **Trusted Account**).

  Your goal is to let \`alex\` read from \`finance-reports\`
  without creating a new IAM user in the trusting account.
`;

const POPUP_MSG3 = `
  ::badge[RULE]:: Cross-account role access is a **two-way agreement**:

  * In the **Trusting Account**, the role's **trust policy** must allow the external principal.
  * In the **Trusted Account**, the user's **identity policy** must allow \`sts:AssumeRole\`
    on that specific role ARN.

  >::badge[WARNING]::  **If either side is missing, role assumption fails**
`;

const POPUP_MSG4 = `
  Cross-account access lets you grant permissions in one account
  to principals from another account.

  This avoids creating and managing duplicate IAM users
  and sharing long-lived credentials across organizations.

  Next, you'll learn **resource-based policies**,
  another way to grant cross-account access.
`;

export const POPUP_TUTORIAL_MESSAGES: PopupTutorialMessage[] = [
  {
    title: 'IAM Roles and Cross-Account Access',
    content: POPUP_MSG1,
  },
  {
    title: 'Cross-Account Access Challenge',
    content: POPUP_MSG2,
  },
  {
    title: 'Two-Way Agreement',
    content: POPUP_MSG3,
  },
  {
    title: 'Cross-Account Access Wrap-up',
    content: POPUP_MSG4,
    go_to_next_level_button: true,
  },
];
