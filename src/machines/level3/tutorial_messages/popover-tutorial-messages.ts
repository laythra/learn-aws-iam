import { PolicyNodeID } from '../types/node-id-enums';
import type { PopoverTutorialMessage } from '@/machines/types';
import { ElementID } from '@/config/element-ids';

export const POPOVER_TUTORIAL_MESSAGES: PopoverTutorialMessage[] = [
  {
    element_id: PolicyNodeID.S3ReadAccess,
    popover_title: 'AWS Managed policies',
    popover_content: `This is an AWS Managed policy, click on the top right to see its contents`,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: ElementID.NewEntityBtn,
    popover_title: 'Your first Customer Managed Policy',
    popover_content: `Let's create your first Customer Managed Policy!`,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: PolicyNodeID.S3ReadWriteAcces,
    popover_title: 'Your first Customer Managed Policy 🔥',
    popover_content: `
      You have created your first Customer Managed Policy!
      You can view its content and attach it to your IAM entities just like an AWS managed one.
    `,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
];
