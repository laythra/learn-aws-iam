import { PolicyNodeID } from '../types/node-id-enums';
import { ElementID } from '@/config/element-ids';
import type { PopoverTutorialMessage } from '@/machines/types';

const POPOVER_MSG1 = `
  Let's create a new policy
`;

const POPOVER_MSG2 = `
  Let's create another shared policy for both groups
`;

const POPOVER_MSG3 = `
  Notice how the same policy granted the appropriate permissions to both groups?
  This is possible because we can inject condition values as variables into the policy,
  enabling us to create a single policy that works across multiple groups.
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
  {
    element_id: PolicyNodeID.RDSSharedPolicy,
    popover_title: 'One policy for both groups! 💪🏻',
    popover_content: POPOVER_MSG3,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'bottom',
  },
];
