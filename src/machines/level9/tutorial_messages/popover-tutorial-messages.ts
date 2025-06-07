import { ResourceNodeID, SCPNodeID } from '../types/node-id-enums';
import { ElementID } from '@/config/element-ids';
import type { PopoverTutorialMessage } from '@/machines/types';

const POPOVER_MSG1 = `
  This is a regular EC2 instance, but it has some tags attached to it.
  Click on the tags 🏷️ icon to view them
`;

const POPOVER_MSG2 = `
  Let's create a **Permission Policy** that allows the creator of this EC2 instance to terminate it.
`;

const POPOVER_MSG3 = `
  Junior users just got their permissions restricted 🚫
`;

export const POPOVER_TUTORIAL_MESSAGES: PopoverTutorialMessage[] = [
  {
    element_id: ResourceNodeID.TutorialEC2Instance2,
    popover_title: 'Tags',
    popover_content: POPOVER_MSG1,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: ElementID.NewEntityBtn,
    popover_title: 'Create a Permission Policy',
    popover_content: POPOVER_MSG2,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'bottom',
  },
  {
    element_id: SCPNodeID.InLevelAccountSCP,
    popover_title: 'You did it! 🎉',
    popover_content: POPOVER_MSG3,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
];
