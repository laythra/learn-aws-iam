import {
  AccountNodeID,
  PolicyNodeID,
  ResourceNodeID,
  SCPNodeID,
  UserNodeID,
} from '../types/node-id-enums';
import { ElementID } from '@/config/element-ids';
import type { PopoverTutorialMessage } from '@/machines/types';

const POPOVER_MSG1 = `
  This is a regular EC2 instance, but it has some tags attached to it.
  Click on the tags 🏷️ icon to view them
`;

const POPOVER_MSG2 = `
  Let's create a **Permission Policy** that allows the creator of this EC2 instance to terminate it.
`;

const POPOVER_MSG3 = `
  Attach the policy to both users
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
  Now, let's create another SCP that blocks access to secrets for all users
  whose names start with \`junior-\`.
`;

const POPOVER_MSG9 = `
  Notice how every user with the name starting with \`junior\` no longer has access to the secret.
`;

const POPOVER_MSG10 = `
  Despite having an SCP that doesn't block any access, the new SCP blocked access to junior users.
  This is because SCPs are intersected — the most restrictive applies.
`;

export const POPOVER_TUTORIAL_MESSAGES: PopoverTutorialMessage[] = [
  {
    element_id: ResourceNodeID.TutorialEC2Instance2,
    popover_title: 'Tags',
    popover_content: POPOVER_MSG1,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: ElementID.NewEntityBtn,
    popover_title: 'Create a Permission Policy',
    popover_content: POPOVER_MSG2,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'bottom',
  },
  {
    element_id: PolicyNodeID.TutorialEC2TerminatePolicy,
    popover_title: 'Apply the Policy',
    popover_content: POPOVER_MSG3,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: UserNodeID.James,
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
    element_id: ResourceNodeID.InLevelSecret1,
    popover_title: 'Access has been blocked',
    popover_content: POPOVER_MSG7,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'right',
  },
  {
    element_id: ElementID.NewEntityBtn,
    popover_title: 'Create another SCP',
    popover_content: POPOVER_MSG8,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'bottom',
  },
  {
    element_id: AccountNodeID.Staging,
    popover_title: 'Access for juniors has been blocked',
    popover_content: POPOVER_MSG9,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'right',
  },
  {
    element_id: SCPNodeID.InLevelOUSCP,
    popover_title: 'SCPs are intersected',
    popover_content: POPOVER_MSG10,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'left',
  },
];
