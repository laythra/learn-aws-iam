import { ElementID } from '@/config/element-ids';
// prettier-ignore
import {
  POPOVER_TUTORIAL_MESSAGES
} from '@/machines/level1/tutorial_messages/popover-tutorial-messages';
import { UserNodeID } from '@/machines/level1/types/node-id-enums';

export const TUTORIAL_STEPS = {
  INITIAL_USER_POPOVERS: [
    { nodeId: UserNodeID.TutorialUser, title: POPOVER_TUTORIAL_MESSAGES[0].popover_title },
    { nodeId: UserNodeID.TutorialUser, title: POPOVER_TUTORIAL_MESSAGES[1].popover_title },
    { nodeId: UserNodeID.TutorialUser, title: POPOVER_TUTORIAL_MESSAGES[2].popover_title },
  ],

  FINAL_POPOVERS: [
    { nodeId: UserNodeID.FirstUser, title: POPOVER_TUTORIAL_MESSAGES[10].popover_title },
    { nodeId: ElementID.ObjectivesSidePanel, title: POPOVER_TUTORIAL_MESSAGES[11].popover_title },
  ],
};
