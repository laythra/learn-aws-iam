import { PolicyNodeID, ResourceNodeID, UserNodeID } from '../types/node-id-enums';
import { ElementID } from '@/config/element-ids';
import type { PopoverTutorialMessage } from '@/machines/types/tutorial-message-types';

const POPOVER_MSG1 = `
  In this interactive journey, every AWS entity you work with is a **node** on the canvas.
`;

const POPOVER_MSG2 = `
  You’re standing on an **IAM User** node.
  Users are how real people (or apps) get access to AWS resources.
`;

const POPOVER_MSG3 = `
  An **IAM User** represents a person or service.
  Try dragging this node around the canvas.
`;

const POPOVER_MSG4 = `
  Besides users, we also model **AWS Resources**.
  This one is an **S3 bucket**.
`;

const POPOVER_MSG5 = `
  And here’s an **IAM Policy** - The crux of AWS access management.


  Policies are JSON rules that say *who* can do *what* on *which* resources.
`;

const POPOVER_MSG6 = `
  Hook this policy up to **Laith** to grant read access to the bucket.
  ::badge[Action]:: Connect policy → user.
`;

const POPOVER_MSG7 = `
  Nice! **Laith** can now read objects in the

  **public-images** bucket. 🎉

  ::badge[Tip]:: Hover the edge between the policy and bucket to see the access level.
`;

const POPOVER_MSG8 = `
  Let’s make *your* own **IAM User** and give them the same access.
`;

// This step intentionally has no message.
const POPOVER_MSG9 = ``;

const POPOVER_MSG10 = `
  Almost there, attach the policy to your new user.
`;

const POPOVER_MSG11 = `
  Done! Both users now have read access to the bucket.
`;

const POPOVER_MSG12 = `
  Need a reminder? Your objectives are always on the right.
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
    popover_title: 'Create your own IAM User',
    popover_content: POPOVER_MSG8,
    show_next_button: false,
    show_close_button: true,
    popover_placement: 'top',
  },
  {
    element_id: ElementID.IAMIdentityNameInput,
    popover_title: 'Name your IAM User',
    popover_content: POPOVER_MSG9,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'start',
  },
  {
    element_id: UserNodeID.FirstUser,
    popover_title: 'Final step',
    popover_content: POPOVER_MSG10,
    show_next_button: false,
    show_close_button: true,
    popover_placement: 'start',
  },
  {
    element_id: UserNodeID.FirstUser,
    popover_title: 'Level 1 completed! 🎉',
    popover_content: POPOVER_MSG11,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'start',
  },
  {
    element_id: ElementID.ObjectivesSidePanel,
    popover_title: 'Your objectives',
    popover_content: POPOVER_MSG12,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'start',
  },
];
