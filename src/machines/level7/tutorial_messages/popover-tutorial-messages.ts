import { PolicyNodeID, ResourceNodeID, UserNodeID } from '../types/node-id-enums';
import { ElementID } from '@/config/element-ids';
import type { PopoverTutorialMessage } from '@/machines/types';

const POPOVER_MSG1 = `
  Let's create your first **Resource Based Policy**.
`;

const POPOVER_MSG2 = `
  We didn't have to attach anything. The policy is directly attached to the resource,
  and principals are auotmatically granted access in return!
`;

const POPOVER_MSG3 = `
  We need to create a **Resource Based Policy** for this **S3 Bucket** which grants
  *read/write* abilities to the external **IAM User "leon-kennedy"**
`;

const POPOVER_MSG4 = `
  The **IAM User** inside the trusted account also needs an **IAM Policy** which allows
  it to perform read/write operations on the **S3 Bucket**.
`;

const POPOVER_MSG5 = ``;

const POPOVER_MSG6 = ``;

const POPOVER_MSG7 = `
  Altough the user is granted direct access via the attached **Identity Based Policy**,
  the **Trusting Account** MUST also trust the **Trusted Account** by having a
  **Resource Based Policy** attached to the **S3 Bucket**.
`;

const POPOVER_MSG8 = ``;

const POPOVER_MSG9 = `
  The **IAM User** has now been granted access to the **S3 Bucket**.
  No **IAM Roles** were involved to achieve this cross-account access.
`;

export const POPOVER_TUTORIAL_MESSAGES: PopoverTutorialMessage[] = [
  {
    element_id: ElementID.NewEntityBtn,
    popover_title: 'Create a Resource Based Policy',
    popover_content: POPOVER_MSG1,
    show_next_button: false,
    show_close_button: true,
    popover_placement: 'bottom',
  },
  {
    element_id: UserNodeID.TutorialFirstUser,
    popover_title: 'voilà! 🪄',
    popover_content: POPOVER_MSG2,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: ResourceNodeID.InsideLevelS3Bucket,
    popover_title: 'Resource Based Policy',
    popover_content: POPOVER_MSG3,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: UserNodeID.InsideLevelUser,
    popover_title: 'Identity Based Policy',
    popover_content: POPOVER_MSG4,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: ElementID.NewEntityBtn,
    popover_title: 'Create the first Identity Based Policy',
    popover_content: POPOVER_MSG5,
    show_next_button: false,
    show_close_button: true,
    popover_placement: 'bottom',
  },
  {
    element_id: PolicyNodeID.InsideLevelIdentityBasedPolicy,
    popover_title: 'You should know this by now...',
    popover_content: POPOVER_MSG6,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'left',
  },
  {
    element_id: UserNodeID.InsideLevelUser,
    popover_title: 'Almost there...',
    popover_content: POPOVER_MSG7,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: ElementID.NewEntityBtn,
    popover_title: 'Create the Resource Based Policy',
    popover_content: POPOVER_MSG8,
    show_next_button: false,
    show_close_button: true,
    popover_placement: 'bottom',
  },
  {
    element_id: UserNodeID.InsideLevelUser,
    popover_title: 'Nailed it',
    popover_content: POPOVER_MSG9,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
];
