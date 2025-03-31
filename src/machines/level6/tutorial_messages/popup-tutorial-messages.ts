import { TUTORIAL_FINISHED_POPUP_MESSAGE } from '@/machines/config';
import { PopupTutorialMessage } from '@/machines/types';
const POPUP_MSG1 = `
  **IAM Roles** are quite powerful in the realm of AWS.
  Aside from providing temporary credentials and access,
  and allowing service to service communication,
  **IAM Roles** are useful for **Cross-Account Access**.|lg

  Suppose you want to grant third-party access to some of your AWS resources,
  roles help with facilitating this.|lg

  The following challenge will test your understanding of roles
  and how they can be used for cross-account access.|lg
`;

const POPUP_MSG2 = `
  Suppose you have a **DynamoDB table** in your AWS account called \`FinanceReports\`
  in which your company stores financial data.|lg

  Your company decides to hire a third-party auditor to audit this financial data,
  noting that this third-party auditor is an **IAM User** inside another AWS account.|lg

  We need to allow the third-party **IAM User** to read data from your account's **DynamoDB table**
  without creating a new **IAM user** inside our account.|lg
`;

const POPUP_MSG3 = `
  Cross Account Access is a powerful feature in AWS that allows
  you to grant access to resources in one account to users in another account.|lg

  This way, we don't need to create and manage new **IAM Users** in the *Trusting Account*
  and have to deal with the pain of maintaing and sharing credentials.|lg

  The next will dive into a new type of policy called **Resource-Based Policies**,
  which can also be used to grant cross-account access, in a slightly different/simpler way.|lg
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
    title: 'Cross-Account Access Wrap-up',
    content: POPUP_MSG3,
  },
  {
    title: 'Congratunlations! Tutorial Wrap-up',
    content: TUTORIAL_FINISHED_POPUP_MESSAGE,
    go_to_next_level_button: true,
  },
];
