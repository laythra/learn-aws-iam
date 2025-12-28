import {
  AccountID,
  OUNodeID,
  PermissionBoundaryID,
  SCPNodeID,
  UserNodeID,
} from '../types/node-id-enums';
import { ElementID } from '@/config/element-ids';
import type { PopoverTutorialMessage } from '@/machines/types/tutorial-message-types';

const POPOVER_MSG1 = `
  This is an **Organizational Unit (OU)**, which is a way to group AWS accounts
  within an AWS Organization.
`;

const POPOVER_MSG2 = `
  Each organizational unit can have AWS accounts which inherit the policies of the OU.

  In this case, the OU has two accounts: **Staging Account** and **Production Account**.

  Take a moment to explore the accounts and their policies.
`;

const POPOVER_MSG3 = `
  By default, every OU has a Service Control Policy (SCP) attached that allows all actions.
  This means that any account within this OU can perform any action allowed by their IAM policies.

  ***View its content by clicking on  the top-right icon on the node.***
`;

const POPOVER_MSG4 = `
  Connect the SCP to the OU and see how it affects the accounts within the OU.
`;

const POPOVER_MSG5 = `
  We need to attach this Permission Boundary somewhere to enforce its restrictions.
`;

const POPOVER_MSG6 = `
  Laith can now safely delegate permissions: he can attach any policies to the ec2-launch-role,
  while the permission boundary ensures the role can only perform allowed actions.
`;

export const POPOVER_TUTORIAL_MESSAGES: PopoverTutorialMessage[] = [
  {
    element_id: OUNodeID.TutorialOU,
    popover_title: 'Organizational Unit (OU)',
    popover_content: POPOVER_MSG1,
    show_close_button: false,
    show_next_button: true,
  },
  {
    element_id: AccountID.TutorialProdAccount,
    popover_title: 'Production Account',
    popover_content: POPOVER_MSG2,
    popover_placement: 'left-start',
    show_close_button: false,
    show_next_button: true,
  },
  {
    element_id: SCPNodeID.DefaultSCP,
    popover_title: 'Service Control Policy (SCP)',
    popover_content: POPOVER_MSG3,
    show_close_button: false,
    show_next_button: false,
  },
  {
    element_id: ElementID.NewEntityBtn,
    popover_title: 'Begin By Creating Your First SCP',
    popover_content: ``,
    popover_placement: 'bottom',
    show_close_button: false,
    show_next_button: false,
  },
  {
    element_id: SCPNodeID.BlockCloudTrailDeletionSCP,
    popover_title: 'SCP Created! Next Step:',
    popover_content: POPOVER_MSG4,
    popover_placement: 'bottom',
    show_close_button: false,
    show_next_button: false,
  },
  {
    element_id: PermissionBoundaryID.Ec2LaunchPermissionBoundary,
    popover_title: 'Permission Boundary Created! 🔥',
    popover_content: POPOVER_MSG5,
    popover_placement: 'top',
    show_close_button: true,
    show_next_button: false,
  },
  {
    element_id: UserNodeID.Laith,
    popover_title: 'Laith Can Now Delegate Permissions Safely!',
    popover_content: POPOVER_MSG6,
    popover_placement: 'top',
    show_close_button: true,
    show_next_button: false,
  },
];
