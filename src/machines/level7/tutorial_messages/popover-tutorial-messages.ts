import { PolicyNodeID, ResourceNodeID, UserNodeID } from '../types/node-id-enums';
import { ElementID } from '@/config/element-ids';
import type { PopoverTutorialMessage } from '@/machines/types/tutorial-message-types';

const POPOVER_MSG1 = `
  Let’s create your first **resource-based policy**.
`;

const POPOVER_MSG2 = `
  No attachments needed here—the policy lives on the resource itself,
  and principals get access automatically.
`;

const POPOVER_MSG3 = `
  Create a **resource-based policy** for this **S3 bucket** that gives
  *read/write* access to the external user **leon-kennedy**.
`;

const POPOVER_MSG4 = `
  The user in the trusted account still needs an **identity-based policy**
  allowing read/write access to this bucket.
`;

const POPOVER_MSG5 = ``;

const POPOVER_MSG6 = ``;

const POPOVER_MSG7 = `
  Even with the user policy attached, the **trusting account** must also allow
  access by attaching a **resource-based policy** to the bucket.
`;

const POPOVER_MSG8 = ``;

const POPOVER_MSG9 = `
  Done! The **IAM User** now has access to the **S3 bucket**
  without using any **IAM Roles**.
`;

export const POPOVER_TUTORIAL_MESSAGES: PopoverTutorialMessage[] = [
  {
    element_id: ElementID.NewEntityBtn,
    popover_title: 'Create a resource-based policy',
    popover_content: POPOVER_MSG1,
    show_next_button: false,
    show_close_button: true,
    popover_placement: 'bottom',
  },
  {
    element_id: UserNodeID.TutorialFirstUser,
    popover_title: 'Voilà! 🪄',
    popover_content: POPOVER_MSG2,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: ResourceNodeID.InsideLevelS3Bucket,
    popover_title: 'Resource-based policy',
    popover_content: POPOVER_MSG3,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: UserNodeID.InsideLevelUser,
    popover_title: 'Identity-based policy',
    popover_content: POPOVER_MSG4,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: ElementID.NewEntityBtn,
    popover_title: 'Create the identity-based policy',
    popover_content: POPOVER_MSG5,
    show_next_button: false,
    show_close_button: true,
    popover_placement: 'bottom',
  },
  {
    element_id: PolicyNodeID.InsideLevelIdentityBasedPolicy,
    popover_title: 'You know the drill',
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
    popover_title: 'Create the resource-based policy',
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
