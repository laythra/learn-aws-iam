import { ResourceNodeID, RoleNodeID, UserNodeID } from '../types/node-id-enums';
import { ElementID } from '@/config/element-ids';
import type { PopoverTutorialMessage } from '@/machines/types/tutorial-message-types';

const POPOVER_MSG1 = `
  Open the role’s **Trust Policy** using the top-right :icon[CodeBracketIcon]: icon.
`;

const POPOVER_MSG3 = `
  Your **IAM User** now has temporary access to **Billing and Cost Management**.
`;
const POPOVER_MSG4 = `
  Create a new **IAM Role** that grants *read access* to the
  \`financial-reports-bucket\` **S3 bucket**.
`;
const POPOVER_MSG5 = `
  This new role currently only has a **Trust Policy**.
`;

const POPOVER_MSG6 = `
  The **Trust Policy** defines *who* can assume the role.
  The attached policies define *what* they can do once they assume it.
`;

const POPOVER_MSG7 = `
  Let’s grant the Finance user *read access* to the **S3 bucket**
  via this new role.
`;

const POPOVER_MSG8 = `
  Nice! The Finance user now has *read access* to the **S3 bucket**
  and **Billing and Cost Management**. 🔥
`;

const POPOVER_MSG9 = `
  Next, we’ll do a more advanced role scenario for **service-to-service** access.
`;

const POPOVER_MSG10 = `
  Your **Lambda function** can now read objects from the S3 bucket.
`;

export const POPOVER_TUTORIAL_MESSAGES: PopoverTutorialMessage[] = [
  {
    element_id: RoleNodeID.FinanceAuditorRole,
    popover_title: 'IAM role for finance auditors',
    popover_content: POPOVER_MSG1,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: ResourceNodeID.BillingAndCostManagement,
    popover_title: 'Great 🎉',
    popover_content: POPOVER_MSG3,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: ElementID.NewEntityBtn,
    popover_title: "Let's create another role",
    popover_content: POPOVER_MSG4,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: RoleNodeID.S3ReadAccessRole,
    popover_title: 'Your new role',
    popover_content: POPOVER_MSG5,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: RoleNodeID.S3ReadAccessRole,
    popover_title: 'Your new role',
    popover_content: POPOVER_MSG6,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: UserNodeID.FinanceUser,
    popover_title: 'S3 bucket access',
    popover_content: POPOVER_MSG7,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'left',
  },
  {
    element_id: UserNodeID.FinanceUser,
    popover_title: 'Great work 🔥',
    popover_content: POPOVER_MSG8,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'left',
  },
  {
    element_id: UserNodeID.FinanceUser,
    popover_title: 'Moving forward',
    popover_content: POPOVER_MSG9,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: ResourceNodeID.LambdaFunction,
    popover_title: 'Great work again 🔥',
    popover_content: POPOVER_MSG10,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
];
