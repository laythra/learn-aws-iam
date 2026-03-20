import { PolicyNodeID, ResourceNodeID, UserNodeID } from '../types/node-ids';
import { ElementID } from '@/config/element-ids';
import type { PopoverTutorialMessage } from '@/levels/types/tutorial-message-types';

const POPOVER_MSG1 = `
  Throughout this tutorial, every **AWS** entity
  is represented as a node on the canvas.
`;

const POPOVER_MSG2 = `
  The node you're looking at right now is an **IAM User**.
  **IAM Users** play a central role in controlling access to **AWS resources**.
`;

const POPOVER_MSG3 = `
  An **IAM User** represents a person or service in your AWS account.
  Try dragging this node to move it around the canvas.
`;

const POPOVER_MSG4 = `
  In addition to **IAM Users**, we also have **AWS Resources**.
  The node you're looking at right now is an **S3 Bucket**.
`;

const POPOVER_MSG5 = `
  Finally, we have **IAM Policies**.
  **IAM Policies** are JSON documents that define what permissions are granted to **IAM Users**.
`;

const POPOVER_MSG6 = `
  Try connecting this **IAM Policy** — which grants read access to the **S3 Bucket** —
  to the **IAM User (alex)** and see what happens.
`;

const POPOVER_MSG7 = `
  **IAM User** (alex) now has read access to the objects inside the S3 Bucket \`public-images\`! 🎉

  Hover over the edge connecting the **IAM Policy** to the **S3 Bucket**
  to inspect the access level.
`;

const POPOVER_MSG8 = `
  Now let's create your own **IAM User** and grant it the same access to the **S3 Bucket**.
`;

// This step intentionally has no message.
const POPOVER_MSG9 = ``;

const POPOVER_MSG10 = `
  You know the drill — connect the **IAM Policy** to your **IAM User**.
`;

const POPOVER_MSG11 = `
  That's it! Both **IAM Users** now have read access to the **S3 Bucket**.
`;

const POPOVER_MSG12 = `
  You can always track your progress by checking the objectives panel on the right.
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
    element_id: UserNodeID.TutorialUser,
    popover_title: 'IAM User',
    popover_content: POPOVER_MSG2,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: UserNodeID.TutorialUser,
    popover_title: 'IAM User',
    popover_content: POPOVER_MSG3,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: ResourceNodeID.PublicImagesS3Bucket,
    popover_title: 'IAM Resources',
    popover_content: POPOVER_MSG4,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: PolicyNodeID.S3ReadPolicy,
    popover_title: 'IAM Policies',
    popover_content: POPOVER_MSG5,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: PolicyNodeID.S3ReadPolicy,
    popover_title: 'IAM Policies',
    popover_content: POPOVER_MSG6,
    show_next_button: false,
    show_close_button: true,
    popover_placement: 'top',
    tutorial_video: 'connecting-nodes',
  },
  {
    element_id: UserNodeID.TutorialUser,
    popover_title: 'Access Granted! 🎉',
    popover_content: POPOVER_MSG7,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: ElementID.NewEntityBtn,
    popover_title: 'Creating your own IAM User',
    popover_content: POPOVER_MSG8,
    show_next_button: false,
    show_close_button: true,
    popover_placement: 'top',
  },
  {
    element_id: ElementID.IAMIdentityNameInput,
    popover_title: "Enter your IAM User's name",
    popover_content: POPOVER_MSG9,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'start',
  },
  {
    element_id: UserNodeID.FirstUser,
    popover_title: 'Final Step',
    popover_content: POPOVER_MSG10,
    show_next_button: false,
    show_close_button: true,
    popover_placement: 'start',
  },
  {
    element_id: UserNodeID.FirstUser,
    popover_title: 'Level 1 Completed! 🎉',
    popover_content: POPOVER_MSG11,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'start',
  },
  {
    element_id: ElementID.ObjectivesSidePanel,
    popover_title: 'Your level objectives',
    popover_content: POPOVER_MSG12,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'start',
  },
];
