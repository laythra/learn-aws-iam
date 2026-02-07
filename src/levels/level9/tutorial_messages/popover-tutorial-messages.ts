import { ElementID } from '@/config/element-ids';
import type { PopoverTutorialMessage } from '@/levels/types/tutorial-message-types';

const POPOVER_MSG1 = `
  Let's create a new policy
`;

const POPOVER_MSG2 = `
  Let's create another shared policy for both groups
`;

export const POPOVER_TUTORIAL_MESSAGES: PopoverTutorialMessage[] = [
  {
    element_id: ElementID.NewEntityBtn,
    popover_title: 'Create New Policy',
    popover_content: POPOVER_MSG1,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'bottom',
  },
  {
    element_id: ElementID.NewEntityBtn,
    popover_title: 'Create Another Policy',
    popover_content: POPOVER_MSG2,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'bottom',
  },
];
