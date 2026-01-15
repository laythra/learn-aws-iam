import { PopupTutorialMessage } from '@/machines/types/tutorial-message-types';
const POPUP_MSG1 = `
  **IAM Roles** are great for temporary access and service-to-service workflows.
  They’re also the go-to for **cross-account access**.|lg

  Need a third party to access your AWS resources? Roles make that safe and clean.|lg

  This challenge is all about using roles for cross-account access.|lg
`;

const POPUP_MSG2 = `
  You’ve got a **DynamoDB table** called \`FinanceReports\` in your account.|lg

  A third-party auditor (an **IAM User** in *another* account) needs read access.|lg

  Goal: grant access **without** creating a new user in your account.|lg
`;

const POPUP_MSG3 = `
  Cross-account access lets you share resources between accounts safely.|lg

  You avoid creating users in your account and handing out credentials.|lg

  Next level: **Resource-based policies**, another way to do cross-account access.
`;

export const POPUP_TUTORIAL_MESSAGES: PopupTutorialMessage[] = [
  {
    title: 'IAM roles and cross-account access',
    content: POPUP_MSG1,
  },
  {
    title: 'Cross-account access challenge',
    content: POPUP_MSG2,
  },
  {
    title: 'Cross-account access wrap-up',
    content: POPUP_MSG3,
    go_to_next_level_button: true,
  },
];
