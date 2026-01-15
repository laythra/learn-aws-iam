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
  This is an **Organizational Unit (OU)**—a way to group AWS accounts
  inside an organization.
`;

const POPOVER_MSG2 = `
  Each OU can have accounts that inherit its policies.

  This OU has **Staging** and **Production**.
  Take a quick look at the accounts and their policies.
`;

const POPOVER_MSG3 = `
  By default, every OU has an SCP that allows all actions.
  That means accounts can do anything their IAM policies allow.

  View it with the top-right :icon[CodeBracketIcon]: icon.
`;

const POPOVER_MSG4 = `
  Connect the SCP to the OU and see the effect on its accounts.
`;

const POPOVER_MSG5 = `
  We need to attach this permission boundary to enforce its limits.
`;

const POPOVER_MSG6 = `
  Laith can now delegate safely: he can attach policies to the ec2-launch role,
  while the permission boundary keeps it within limits.
`;

export const POPOVER_TUTORIAL_MESSAGES: PopoverTutorialMessage[] = [
  {
    element_id: OUNodeID.TutorialOU,
    popover_title: 'Organizational unit (OU)',
    popover_content: POPOVER_MSG1,
    show_close_button: false,
    show_next_button: true,
  },
  {
    element_id: AccountID.TutorialProdAccount,
    popover_title: 'Production account',
    popover_content: POPOVER_MSG2,
    popover_placement: 'left-start',
    show_close_button: false,
    show_next_button: true,
  },
  {
    element_id: SCPNodeID.DefaultSCP,
    popover_title: 'Service control policy (SCP)',
    popover_content: POPOVER_MSG3,
    show_close_button: false,
    show_next_button: false,
  },
  {
    element_id: ElementID.NewEntityBtn,
    popover_title: 'Create your first SCP',
    popover_content: 'Create an SCP to lock down CloudTrail deletions.',
    popover_placement: 'bottom',
    show_close_button: false,
    show_next_button: false,
  },
  {
    element_id: SCPNodeID.BlockCloudTrailDeletionSCP,
    popover_title: 'SCP created! Next step:',
    popover_content: POPOVER_MSG4,
    popover_placement: 'bottom',
    show_close_button: false,
    show_next_button: false,
  },
  {
    element_id: PermissionBoundaryID.Ec2LaunchPermissionBoundary,
    popover_title: 'Permission boundary created! 🔥',
    popover_content: POPOVER_MSG5,
    popover_placement: 'top',
    show_close_button: true,
    show_next_button: false,
  },
  {
    element_id: UserNodeID.Laith,
    popover_title: 'Laith can now delegate safely!',
    popover_content: POPOVER_MSG6,
    popover_placement: 'top',
    show_close_button: true,
    show_next_button: false,
  },
];
