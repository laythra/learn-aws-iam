import { PolicyNodeID, ResourceNodeID, UserNodeID } from '../types/node-id-enums';
import { ElementID } from '@/config/element-ids';
import type { PopoverTutorialMessage } from '@/machines/types/tutorial-message-types';

const POPOVER_MSG1 = `
  Throughout this interactive tutorial, every entity in **AWS**
  will be represented as a "Node" in our canvas.
`;

const POPOVER_MSG2 = `
  The Node we're currently standing on is an **IAM User**.
  **IAM Users** Play a crucial role in managing access to **AWS resources**.
`;

const POPOVER_MSG3 = `
  An **IAM User** is an entity that you create in AWS to represent a person or service.
  Try moving this node around by dragging it.
`;

const POPOVER_MSG4 = `
  Aside from **IAM Users**, we also have **AWS Resources**.
  The **AWS Resource** we're currently standing on is an **S3 bucket**.
`;

const POPOVER_MSG5 = `
  Last but not least, we have **IAM Policies**.
  **IAM Policies** are JSON documents that define the permissions we want to grant to **IAM Users**.
`;

const POPOVER_MSG6 = `
  Try attaching this **IAM Policy** - which grants read access to the **S3 bucket** -
  to the **IAM User (Laith)** and see what happens next.
`;

const POPOVER_MSG7 = `
  The **IAM User** (Laith) has been granted read permissions to the
  object inside the S3 Bucket \`public-images\`! 🎉

  You can hover over the edge connecting the **IAM Policy** and the **S3 Bucket**
  to see the access level
`;

const POPOVER_MSG8 = `
  How about we create your own **IAM User** and grant it the same access to the **S3 bucket**?
`;

// This step intentionally has no message.
const POPOVER_MSG9 = ``;

const POPOVER_MSG10 = `
  You should know the drill by now - attach the **IAM Policy** to the **IAM User**
`;

const POPOVER_MSG11 = `
  There you have it! Both **IAM Users** have been granted read access to the **S3 bucket**.
`;

const POPOVER_MSG12 = `
  By the way, you can always check your objectives on the right side of the screen.
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
    tutorial_gif: 'connecting-nodes',
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
