import { PopupTutorialMessage } from '@/machines/types';
const POPUP_MSG1 = `
  Roles are quite powerful in the realm of AWS.
  Aside from providing temporary credentials and access,
  and allowing service to service communication, roles are useful for **Cross-Account Access**.|lg


  Suppose you want to grant third-party access to some of your AWS resources,
  roles help with facilitating this.|lg

  The following challenge will test your understanding of roles
  and how they can be used for cross-account access.|lg
`;

const POPUP_MSG2 = `
  Suppose you have a **DynamoDB** table in your AWS account called \`FinanceReports\`
  in which your company stores financial data.|lg

  Your company decides to hire a third-party auditor to audit this financial data,
  noting that this third-party auditor is an **IAM user** inside another AWS account.|lg

  We need to allow this **IAM user** to read the data from this DynamoDB table
  without creating a new **IAM user** inside our account.|lg

  &nbsp;

  All required account IDs and ARNs are mentioned in the objectives in the right side panel
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
];
