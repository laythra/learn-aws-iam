import { PolicyNodeID } from '../types/node-id-enums';
import { ElementID } from '@/config/element-ids';
import type { PopoverTutorialMessage } from '@/machines/types';

const POPOVER_MSG1 = `
  Level detailed objectives can be found in the right side panel.
`;

const POPOVER_MSG2 = `
  This was a tough policy to create, you nailed it!

  keep on...
`;

export const POPOVER_TUTORIAL_MESSAGES: PopoverTutorialMessage[] = [
  {
    element_id: ElementID.RightSidePanelToggleButton,
    popover_title: 'Level Objectives',
    popover_content: POPOVER_MSG1,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'bottom',
  },
  {
    element_id: PolicyNodeID.TBACPolicy,
    popover_title: "You're a pro by now",
    popover_content: POPOVER_MSG2,
    show_next_button: false,
    show_close_button: true,
    popover_placement: 'top',
  },
];
