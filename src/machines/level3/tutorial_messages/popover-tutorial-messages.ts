import { PolicyNodeID, ResourceNodeID } from '../types/node-id-enums';
import { ElementID } from '@/config/element-ids';
import type { PopoverTutorialMessage } from '@/machines/types';

const POPOVER_MSG1 = `
  This is an **AWS Managed policy**, click on the top right icon to see its contents
`;

const POPOVER_MSG2 = `
  This is an **S3 Bucket**. View and Copy the \`ARN\` by clicking
  on the top-left icon -Remember, the \`ARN\` is a unique identifier for an AWS resource-.
`;

const POPOVER_MSG3 = `
  Using the \`ARN\` you copied, let's create a new **Customer Managed Policy**.
`;

const POPOVER_MSG4 = `
  You have created your first Customer Managed Policy!
  Warm up phase is over, click "NEXT" to proceed to the level's next part.
`;

const POPOVER_MSG5 = `
  In case you hadn't noticed, the list of objectives you need
  to complete is on the right side panel
`;

export const POPOVER_TUTORIAL_MESSAGES: PopoverTutorialMessage[] = [
  {
    element_id: PolicyNodeID.S3ReadAccess,
    popover_title: 'AWS Managed policies',
    popover_content: POPOVER_MSG1,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: ResourceNodeID.PublicImagesS3Bucket,
    popover_title: 'Grab the ARN',
    popover_content: POPOVER_MSG2,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: ElementID.NewEntityBtn,
    popover_title: "Let's create your first Customer Managed Policy",
    popover_content: POPOVER_MSG3,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: PolicyNodeID.S3ReadWriteAcces,
    popover_title: 'Your first Customer Managed Policy 🔥',
    popover_content: POPOVER_MSG4,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: ElementID.ObjectivesSidePanel,
    popover_title: 'Your on your own now',
    popover_content: POPOVER_MSG5,
    show_next_button: false,
    show_close_button: true,
    popover_placement: 'start',
  },
];
