import { PolicyNodeID } from '../types/node-id-enums';
import { ElementID } from '@/config/element-ids';
import type { PopoverTutorialMessage } from '@/machines/types';

const POPOVER_MSG1 = `
  This is an **AWS Managed policy**, click on the top right icon to see its contents
`;

const POPOVER_MSG2 = `
  Let's create your first **Customer Managed Policy**!
`;

const POPOVER_MSG3 = `
  You have created your first Customer Managed Policy!
  You can view its content and attach it to your IAM entities just like an AWS managed one.
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
    element_id: ElementID.NewEntityBtn,
    popover_title: 'Your first Customer Managed Policy',
    popover_content: POPOVER_MSG2,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: PolicyNodeID.S3ReadWriteAcces,
    popover_title: 'Your first Customer Managed Policy 🔥',
    popover_content: POPOVER_MSG3,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
];
