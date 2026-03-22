import { PolicyNodeID, UserNodeID } from '../types/node-ids';
import { ElementID } from '@/config/element-ids';
import type { PopoverTutorialMessage } from '@/types/tutorial-message-types';

const POPOVER_MSG1 = `
  Create the first team-specific policy.
`;

const POPOVER_MSG2 = `
  Notice how this user didn't get access, despite being in the same group.
  Why do you think that is? 🤔
`;

const POPOVER_MSG3 = `
  Now replace those two policies with one shared policy for both groups.
`;

const POPOVER_MSG4 = `
  ::badge[TIP]:: This policy can now be extended to any number of teams,
  as long as the appropriate tags are in place.
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
    element_id: UserNodeID.Morgan,
    popover_title: 'No Access for This User?',
    popover_content: POPOVER_MSG2,
    show_next_button: false,
    show_close_button: true,
    popover_placement: 'right',
  },
  {
    element_id: ElementID.NewEntityBtn,
    popover_title: 'Create Another Policy',
    popover_content: POPOVER_MSG3,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'bottom',
  },
  {
    element_id: PolicyNodeID.RDSSharedPolicy,
    popover_title: 'A Generic Policy for All Teams',
    popover_content: POPOVER_MSG4,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
];
