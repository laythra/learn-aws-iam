import { PolicyNodeID } from '../types/node-id-enums';
import { ElementID } from '@/config/element-ids';
import type { PopoverTutorialMessage } from '@/machines/types/tutorial-message-types';

const POPOVER_MSG1 = `
  Create your first policy to handle tag creation and enforcement.
`;

const POPOVER_MSG2 = `
  That policy was easily one of the hardest ones yet!

  Keep the momentum going!
`;

const POPOVER_MSG3 = `
  Create your RDS management policy.
`;

const POPOVER_MSG4 = `
  Attach the policy to the groups so they can use it.
`;

export const POPOVER_TUTORIAL_MESSAGES: PopoverTutorialMessage[] = [
  {
    element_id: ElementID.NewEntityBtn,
    popover_title: 'Create your first policy',
    popover_content: POPOVER_MSG1,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'left',
  },
  {
    element_id: PolicyNodeID.TBACPolicy,
    popover_title: "You're a pro by now",
    popover_content: POPOVER_MSG2,
    show_next_button: false,
    show_close_button: true,
    popover_placement: 'top',
  },
  {
    element_id: ElementID.NewEntityBtn,
    popover_title: "Second policy, let's go",
    popover_content: POPOVER_MSG3,
    show_next_button: false,
    show_close_button: true,
    popover_placement: 'top',
  },
  {
    element_id: PolicyNodeID.RDSManagePolicy,
    popover_title: 'You know the drill',
    popover_content: POPOVER_MSG4,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'top',
  },
];
