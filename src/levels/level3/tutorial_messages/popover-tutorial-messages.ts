import { PolicyNodeID, ResourceNodeID } from '../types/node-ids';
import { ElementID } from '@/config/element-ids';
import type { PopoverTutorialMessage } from '@/levels/types/tutorial-message-types';

const POPOVER_MSG1 = `
  This is an **AWS Managed Policy**. Click the top-right icon \`::icon[CodeBracketIcon]::\`
  to view its contents.
`;

const POPOVER_MSG2 = ``;

const POPOVER_MSG3 = `
  Using the \`ARN\` you copied, create a new **Customer Managed Policy**.
`;

const POPOVER_MSG4 = `
  You've created your first Customer Managed Policy!
  The warm-up phase is over — click ***NEXT*** to proceed to the next part of the level.
`;

const POPOVER_MSG5 = `
  Check the right panel for hints and tips.
`;

export const POPOVER_TUTORIAL_MESSAGES: PopoverTutorialMessage[] = [
  {
    element_id: PolicyNodeID.S3ListBucketsPolicy,
    popover_title: 'AWS Managed policies',
    popover_content: POPOVER_MSG1,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: ResourceNodeID.PublicImagesS3Bucket,
    popover_title: 'Grab the S3 Bucket ARN',
    popover_content: POPOVER_MSG2,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'right',
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
    element_id: PolicyNodeID.S3ReadPolicy,
    popover_title: 'Your first Customer Managed Policy 🔥',
    popover_content: POPOVER_MSG4,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: ElementID.ObjectivesSidePanel,
    popover_title: "You're on your own now",
    popover_content: POPOVER_MSG5,
    show_next_button: false,
    show_close_button: true,
    popover_placement: 'start',
  },
];
