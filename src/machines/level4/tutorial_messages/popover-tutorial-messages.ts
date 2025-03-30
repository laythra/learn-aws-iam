import { PolicyNodeID } from '../types/node-id-enums';
import { ElementID } from '@/config/element-ids';
import type { PopoverTutorialMessage } from '@/machines/types';

const POPOVER_MSG1 = `
  This Level requires Editing existing **Customer Managed Policies**
  to ensure that the permissions are correct.

  You should be able to see an Edit button on the right side of the policy's content.
`;

const POPOVER_MSG2 = `
  As usual, you'll find the list of objectives in the right side panel. Good Luck! 💪 |lg
`;

export const POPOVER_TUTORIAL_MESSAGES: PopoverTutorialMessage[] = [
  {
    element_id: PolicyNodeID.DeveloperPolicy,
    popover_title: 'Editing Policies',
    popover_content: POPOVER_MSG1,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: ElementID.RightSidePanelToggleButton,
    popover_title: "You're on your own",
    popover_content: POPOVER_MSG2,
    show_next_button: false,
    show_close_button: true,
    popover_placement: 'top',
  },
];
