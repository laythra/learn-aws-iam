import { PolicyNodeID, ResourceNodeID, UserNodeID } from '../types/node-id-enums';
import type { PopoverTutorialMessage } from '@/machines/types';
import { PopoverElementID } from '@/theme';

const POPOVER_MSG1 = `
  This is an **IAM user**.
  It represents a person or service that can interact with AWS resources
`;

const POPOVER_MSG2 = `
  This **S3 bucket** represents an AWS resource that you can control access to
`;

const POPOVER_MSG3 = `
  This **IAM policy** is a document that defines actions that can performed on **AWS resources**
      (The **S3 Bucket** you've just been introduced to for example)
`;

const POPOVER_MSG4 = `
  Initially, an **IAM User** has no sort of access to any AWS resources.
  To grant access, you can attach policies to the targeted **IAM User**.
`;

const POPOVER_MSG5 = `
  Try attaching this **IAM Policy** - which grants read access to the **S3 bucket** -
  to the **IAM User (Laith)** and see what happens next.
`;

const POPOVER_MSG6 = `
  The **IAM User** has read permissions to the **S3 Bucket** \`public-images\`! 🎉

  You can hover over the edge connecting the **IAM Policy** and the **S3 Bucket**
  to see the access level
`;

const POPOVER_MSG7 = `
  Let's begin by creating your **IAM user**, shall we?
`;

const POPOVER_MSG8 = `
  Your IAM user's name
`;

const POPOVER_MSG9 = `
  We also want to grant the user access to the **S3 bucket**.
`;

const POPOVER_MSG10 = `
  Your **IAM User** now has read access to the **S3 Bucket** \`public-images\`! 🎉
  You can notice that users initially have no access to any AWS resources.
  In a real world scenario, you would attach policies to the user to grant access to resources.
`;

export const POPOVER_TUTORIAL_MESSAGES: PopoverTutorialMessage[] = [
  {
    element_id: UserNodeID.TutorialUser,
    popover_title: 'IAM User',
    popover_content: POPOVER_MSG1,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: ResourceNodeID.PublicImagesS3Bucket,
    popover_title: 'S3 Bucket',
    popover_content: POPOVER_MSG2,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: PolicyNodeID.S3ReadPolicy,
    popover_title: 'IAM Policies',
    popover_content: POPOVER_MSG3,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: UserNodeID.TutorialUser,
    popover_title: 'IAM User initial permissions',
    popover_content: POPOVER_MSG4,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: PolicyNodeID.S3ReadPolicy,
    popover_title: 'Granting Resource Access',
    popover_content: POPOVER_MSG5,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: UserNodeID.TutorialUser,
    popover_title: 'Access Granted! 🎉',
    popover_content: POPOVER_MSG6,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: PopoverElementID.NewEntityBtn,
    popover_title: 'Creating your IAM User',
    popover_content: POPOVER_MSG7,
    show_next_button: false,
    show_close_button: false,
  },
  {
    element_id: PopoverElementID.IAMIdentityNameInput,
    popover_title: POPOVER_MSG8,
    popover_content: ``,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'start',
  },
  {
    element_id: UserNodeID.FirstUser,
    popover_title: `Granting Access to S3 Bucket`,
    popover_content: POPOVER_MSG9,
    show_next_button: true,
    show_close_button: false,
  },
  {
    element_id: UserNodeID.FirstUser,
    popover_title: `All Done!`,
    popover_content: POPOVER_MSG10,
    show_next_button: true,
    show_close_button: false,
  },
];
