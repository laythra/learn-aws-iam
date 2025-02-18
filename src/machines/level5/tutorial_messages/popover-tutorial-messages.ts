import { ResourceNodeID, RoleNodeID, UserNodeID } from '../types/node-id-enums';
import { ElementID } from '@/config/element-ids';
import type { PopoverTutorialMessage } from '@/machines/types';

export const POPOVER_TUTORIAL_MESSAGES: PopoverTutorialMessage[] = [
  {
    element_id: RoleNodeID.FinanceAuditorRole,
    popover_title: 'IAM Role for Finance Auditors',
    popover_content: `
      Click on the top right to see view its trust policy,
      and notice how the principal here is an IAM user
    `,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: RoleNodeID.FinanceAuditorRole,
    popover_title: 'Attach role to user',
    popover_content: `Try attaching the role to the Finance User`,
    show_next_button: false,
    show_close_button: true,
    popover_placement: 'top',
  },
  {
    element_id: ResourceNodeID.BillingAndCostManagement,
    popover_title: 'Great 🎉',
    popover_content: `
      Your IAM user now has temporary access to the Billing and Cost Management service
    `,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: ElementID.NewEntityBtn,
    popover_title: "Let's create another Role",
    popover_content: 'We want to create a new role that allows read access to S3',
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: RoleNodeID.S3ReadAccessRole,
    popover_title: 'Your new Role',
    popover_content: 'The role you created merely has a "Trust Policy" attached to it',
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: RoleNodeID.S3ReadAccessRole,
    popover_title: 'Your new Role',
    popover_content: `
       The Trust Policy defines who's allowed to assume the role,
       as for what the user can do with the role that depends on the attached policies
    `,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: UserNodeID.FinanceUser,
    popover_title: 'S3 Bucket Access',
    popover_content: `
      Let's give the Finance User read access to the S3 bucket
    `,
    show_next_button: false,
    show_close_button: true,
    popover_placement: 'top',
  },
  {
    element_id: UserNodeID.FinanceUser,
    popover_title: 'Great Work 🔥',
    popover_content: `
      Your Finance User now has read access to the S3 bucket
      and the Billing and Cost Management service
    `,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: UserNodeID.FinanceUser,
    popover_title: 'Moving Forward',
    popover_content: `
      We're going to introduce a more intricate scenario involving IAM roles,
      involving service-to-service communication
    `,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: ResourceNodeID.LambdaFunction,
    popover_title: 'Great Work Again 🔥',
    popover_content: `
      Your Lambda function now has the necessary permissions to read objects from the S3 bucket
    `,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
];
