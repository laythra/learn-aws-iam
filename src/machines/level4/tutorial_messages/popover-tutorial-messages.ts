import { PolicyNodeID } from '../types/node-id-enums';
import { ElementID } from '@/config/element-ids';
import type { PopoverTutorialMessage } from '@/machines/types/tutorial-message-types';

const POPOVER_MSG1 = `
  This level is about editing existing **Customer Managed Policies**
  to make sure permissions are correct.

  Look for the edit :icon[PencilSquareIcon]: button on the right of the policy content.
`;

const POPOVER_MSG2 = `
  Your objectives live in the right panel. You’ve got this. 💪
`;

export const POPOVER_TUTORIAL_MESSAGES: PopoverTutorialMessage[] = [
  {
    element_id: PolicyNodeID.DeveloperPolicy,
    popover_title: 'Editing policies',
    popover_content: POPOVER_MSG1,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: ElementID.RightSidePanelToggleButton,
    popover_title: 'You’re on your own',
    popover_content: POPOVER_MSG2,
    show_next_button: false,
    show_close_button: true,
    popover_placement: 'top',
  },
];
