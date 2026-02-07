import { PolicyNodeID } from '../types/node-id-enums';
import { ElementID } from '@/config/element-ids';
import type { PopoverTutorialMessage } from '@/levels/types/tutorial-message-types';

const POPOVER_MSG1 = ``;

const POPOVER_MSG2 = `
  This was a tough policy to create, you nailed it!

  keep on...
`;

const POPOVER_MSG3 = `
  Create your RDS management policy.
`;

const POPOVER_MSG4 = `
  Grant the policy to the groups
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
    popover_title: "Second Policy let's go",
    popover_content: POPOVER_MSG3,
    show_next_button: false,
    show_close_button: true,
    popover_placement: 'top',
  },
  {
    element_id: PolicyNodeID.RDSManagePolicy,
    popover_title: 'You know the drill by now',
    popover_content: POPOVER_MSG4,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'top',
  },
];
