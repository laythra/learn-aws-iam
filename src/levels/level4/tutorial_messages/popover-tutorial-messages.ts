import { ElementID } from '@/config/element-ids';
import type { PopoverTutorialMessage } from '@/types/tutorial-message-types';

const POPOVER_MSG1 = `
  Your objectives are listed in the right panel. Good luck! 💪|lg

  ***Click 'Next' to start your mission.***
`;

export const POPOVER_TUTORIAL_MESSAGES: PopoverTutorialMessage[] = [
  {
    element_id: ElementID.RightSidePanelToggleButton,
    popover_title: "You're on your own",
    popover_content: POPOVER_MSG1,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
];
