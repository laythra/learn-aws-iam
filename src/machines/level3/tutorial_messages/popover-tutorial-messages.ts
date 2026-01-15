import { PolicyNodeID, ResourceNodeID } from '../types/node-id-enums';
import { ElementID } from '@/config/element-ids';
import type { PopoverTutorialMessage } from '@/machines/types/tutorial-message-types';

const POPOVER_MSG1 = `
  This is an **AWS Managed Policy**.
  Click the top-right :icon[CodeBracketIcon]: icon to peek at its JSON.
`;

const POPOVER_MSG2 = ``;

const POPOVER_MSG3 = `
  Use that **ARN** to create a **Customer Managed Policy**.
`;

const POPOVER_MSG4 = `
  You just created your first customer managed policy—nice.
  ::badge[Next]:: Click *NEXT* to keep rolling.
`;

const POPOVER_MSG5 = `
  Need help? The right panel has hints if you get stuck.
`;

export const POPOVER_TUTORIAL_MESSAGES: PopoverTutorialMessage[] = [
  {
    element_id: PolicyNodeID.S3ListBucketsPolicy,
    popover_title: 'AWS managed policies',
    popover_content: POPOVER_MSG1,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: ResourceNodeID.PublicImagesS3Bucket,
    popover_title: 'Grab the S3 bucket ARN',
    popover_content: POPOVER_MSG2,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'right',
  },
  {
    element_id: ElementID.NewEntityBtn,
    popover_title: 'Create your first customer managed policy',
    popover_content: POPOVER_MSG3,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: PolicyNodeID.S3ReadPolicy,
    popover_title: 'Your first customer managed policy 🔥',
    popover_content: POPOVER_MSG4,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: ElementID.ObjectivesSidePanel,
    popover_title: 'You got this',
    popover_content: POPOVER_MSG5,
    show_next_button: false,
    show_close_button: true,
    popover_placement: 'start',
  },
];
