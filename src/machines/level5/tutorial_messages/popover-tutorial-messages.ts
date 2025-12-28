import { ResourceNodeID, RoleNodeID, UserNodeID } from '../types/node-id-enums';
import { ElementID } from '@/config/element-ids';
import type { PopoverTutorialMessage } from '@/machines/types/tutorial-message-types';

const POPOVER_MSG1 = `
  Click on the top right to see view its **Trust Policy**
`;

const POPOVER_MSG3 = `
  Your **IAM User** now has temporary access to the **Billing and Cost Management Service**
`;
const POPOVER_MSG4 = `
  We want to create a new **IAM Role** that permits *read access* to the **S3 Bucket**
  \`financial-reports-bucket\`
`;
const POPOVER_MSG5 = `
  The **IAM Role** you just created merely has a "Trust Policy" attached to it
`;

const POPOVER_MSG6 = `
  The **Trust Policy** specifies who can assume the role,
  while the permissions granted to the principal are determined by the attached policies
`;

const POPOVER_MSG7 = `
  Let's give the Finance User *read access* to the **S3 bucket**
  through a new **IAM Role**
`;

const POPOVER_MSG8 = `
  Your Finance User now has *read access* to the **S3 bucket**
  and the **Billing and Cost Management service** 🔥
`;

const POPOVER_MSG9 = `
  We're going to introduce a more intricate scenario involving **IAM Role**,
  involving service-to-service communication
`;

const POPOVER_MSG10 = `
  Your **Lambda Function** now has the necessary permissions to read objects from the S3 bucket
`;

export const POPOVER_TUTORIAL_MESSAGES: PopoverTutorialMessage[] = [
  {
    element_id: RoleNodeID.FinanceAuditorRole,
    popover_title: 'IAM Role for Finance Auditors',
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
    popover_title: "Let's create another Role",
    popover_content: POPOVER_MSG4,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: RoleNodeID.S3ReadAccessRole,
    popover_title: 'Your new Role',
    popover_content: POPOVER_MSG5,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: RoleNodeID.S3ReadAccessRole,
    popover_title: 'Your new Role',
    popover_content: POPOVER_MSG6,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: UserNodeID.FinanceUser,
    popover_title: 'S3 Bucket Access',
    popover_content: POPOVER_MSG7,
    show_next_button: false,
    show_close_button: true,
    popover_placement: 'top',
  },
  {
    element_id: UserNodeID.FinanceUser,
    popover_title: 'Great Work 🔥',
    popover_content: POPOVER_MSG8,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: UserNodeID.FinanceUser,
    popover_title: 'Moving Forward',
    popover_content: POPOVER_MSG9,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: ResourceNodeID.LambdaFunction,
    popover_title: 'Great Work Again 🔥',
    popover_content: POPOVER_MSG10,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
];
