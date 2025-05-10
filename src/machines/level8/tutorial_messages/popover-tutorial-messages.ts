import { AccountNodeID, OUNodeID, SCPNodeID, UserNodeID } from '../types/node-id-enums';
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
];
