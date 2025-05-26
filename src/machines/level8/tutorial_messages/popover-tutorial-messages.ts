import {
  AccountNodeID,
  OUNodeID,
  ResourceNodeID,
  SCPNodeID,
  UserNodeID,
} from '../types/node-id-enums';
import { ElementID } from '@/config/element-ids';
import type { PopoverTutorialMessage } from '@/machines/types';

const POPOVER_MSG1 = `
  What you're seeing here is an **Organization Unit** attached to it is an **AWS Account**.
`;

const POPOVER_MSG2 = `
  an OU could contain multiple **AWS Accounts**.
  Think of it as a logical grouping of accounts. Right now, it contains only one Account.
`;

const POPOVER_MSG3 = `
  This represents an **AWS Account**.
  An AWS account serves as a secure and isolated container for your cloud resources,
  enabling you to manage permissions, billing, and resource organization effectively.
`;

const POPOVER_MSG4 = `
  Lastly, this is an **IAM User** residing within the **AWS Account**.
  The user is granted ***read*** access to a bunch of secrets in the account
  through the IAM policy attached to it.
`;

const POPOVER_MSG5 = `
  Let's create your first ***Service Control Policy (SCP)***
`;

const POPOVER_MSG6 = `
  Attach the SCP to the **Organization Unit**.
 `;

const POPOVER_MSG7 = `
  Edges marked in red with a 🔒 icon indicate blocked access,
  even if an IAM policy explicitly allows it.
  Try hovering over the red edges.
`;

const POPOVER_MSG8 = `
  The user \`Clark\` has access to a secret in another account. we want to block this access without
  removing the IAM policy that allows it.
`;

const POPOVER_MSG9 = `
  The OU has an SCP attached to it that allows full access to every aws service
`;

// const POPOVER_MSG89 = `
//   User \`Clark\` can no longer access the secret despite having an IAM policy that allows it. 🔒
// `;

// const POPOVER_MSG90 = `
//   Even with an SCP that allows full access, the new SCP blocked access to
//   the secret because SCPs are intersected — the most restrictive applies.
// `;

export const POPOVER_TUTORIAL_MESSAGES: PopoverTutorialMessage[] = [
  {
    element_id: OUNodeID.Dev,
    popover_title: 'Organization Unit',
    popover_content: POPOVER_MSG1,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'left',
  },
  {
    element_id: OUNodeID.Dev,
    popover_title: 'Organization Unit',
    popover_content: POPOVER_MSG2,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'left',
  },
  {
    element_id: AccountNodeID.Dev,
    popover_title: 'AWS Account',
    popover_content: POPOVER_MSG3,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'right-end',
  },
  {
    element_id: UserNodeID.TutorialFirstUser,
    popover_title: 'IAM User',
    popover_content: POPOVER_MSG4,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'right-end',
  },
  {
    element_id: ElementID.NewEntityBtn,
    popover_title: 'IAM User',
    popover_content: POPOVER_MSG5,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'right-end',
  },
  {
    element_id: SCPNodeID.TutorialSCP,
    popover_title: 'Your First SCP',
    popover_content: POPOVER_MSG6,
    show_next_button: false,
    show_close_button: true,
    popover_placement: 'right-end',
  },
  {
    element_id: ResourceNodeID.TutorialSecret1,
    popover_title: 'Access has been blocked',
    popover_content: POPOVER_MSG7,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'right',
  },
  {
    element_id: UserNodeID.InsideLevelUser3,
    popover_title: 'Access has been blocked',
    popover_content: POPOVER_MSG8,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'right',
  },
  {
    element_id: SCPNodeID.InLevelOUSCP,
    popover_title: 'SCPs are intersected',
    popover_content: POPOVER_MSG9,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'right',
  },
];
