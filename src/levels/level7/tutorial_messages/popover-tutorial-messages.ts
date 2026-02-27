import { PolicyNodeID, ResourceNodeID, UserNodeID } from '../types/node-id-enums';
import { ElementID } from '@/config/element-ids';
import type { PopoverTutorialMessage } from '@/levels/types/tutorial-message-types';

const POPOVER_MSG1 = `
  Let's create your first **resource-based policy**.
`;

const POPOVER_MSG2 = `
  We didn't have to attach anything. The policy is directly attached to the resource,
  and allowed principals automatically gain the specified access.
`;

const POPOVER_MSG3 = `
  We need to create a **resource-based policy** for this **S3 bucket**
  that grants *read/write* access to the external IAM user \`leon-kennedy\`.
`;

const POPOVER_MSG4 = `
  The IAM user in the trusted account also needs an **identity-based policy**
  that allows read/write actions on the **S3 bucket**.
`;

const POPOVER_MSG5 = `
  Create an identity-based policy for \`leon-kennedy\`
  with \`s3:GetObject\` and \`s3:PutObject\` on \`rpd-case-files/*\`.
`;

const POPOVER_MSG6 = `
  Great. Now attach this identity-based policy to the IAM user \`leon-kennedy\`.
`;

const POPOVER_MSG7 = `
  Although the user now has identity permissions, cross-account access is still not complete.
  The **trusting account** must also allow that principal through
  a **resource-based policy** on the **S3 bucket**.
`;

const POPOVER_MSG8 = `
  Create the resource-based policy on \`rpd-case-files\`
  and set \`leon-kennedy\` as the allowed principal.
`;

const POPOVER_MSG9 = `
  The IAM user now has cross-account access to the **S3 bucket**.
  No IAM role assumption was required.
`;

export const POPOVER_TUTORIAL_MESSAGES: PopoverTutorialMessage[] = [
  {
    element_id: ElementID.NewEntityBtn,
    popover_title: 'Create a Resource-Based Policy',
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
    popover_title: 'Resource-Based Policy',
    popover_content: POPOVER_MSG3,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: UserNodeID.InsideLevelUser,
    popover_title: 'Identity-Based Policy',
    popover_content: POPOVER_MSG4,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: ElementID.NewEntityBtn,
    popover_title: 'Create the First Identity-Based Policy',
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
    popover_title: 'Create the Resource-Based Policy',
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
