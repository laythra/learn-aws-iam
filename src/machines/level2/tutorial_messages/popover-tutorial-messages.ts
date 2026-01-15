import { GroupNodeID, UserNodeID } from '../types/node-id-enums';
import { ElementID } from '@/config/element-ids';
import type { PopoverTutorialMessage } from '@/machines/types/tutorial-message-types';

const POPOVER_MSG1 = `
  This user has a bunch of **IAM Policies** attached.

  Let’s clean that up by using an **IAM Group** instead.

  Hit *NEXT* to start fresh.
`;

const POPOVER_MSG3 = ``;

const POPOVER_MSG2 = `
  Create your first **IAM Group**.
`;

const POPOVER_MSG4 = `
  Groups can have **users** and **policies** attached.
  ::badge[Tip]:: Attach the policies here and users inherit them.
`;

const POPOVER_MSG5 = `
  See that? The **IAM User** inherited the group’s policies automatically.
`;

const POPOVER_MSG6 = `
  Let’s scale it up—add another **user** to the group.
  Create a new user and attach them to the group.
`;

const POPOVER_MSG7 = `
  Boom. The new user got all the group’s **policies** in one shot.
  Way easier than attaching policies to each user.
`;

export const POPOVER_TUTORIAL_MESSAGES: PopoverTutorialMessage[] = [
  {
    element_id: UserNodeID.FirstUser,
    popover_title: 'Current user permissions',
    popover_content: POPOVER_MSG1,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'right',
  },
  {
    element_id: ElementID.NewEntityBtn,
    popover_title: 'IAM Groups',
    popover_content: POPOVER_MSG2,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: ElementID.IAMIdentityNameInput,
    popover_title: 'Name your group',
    popover_content: POPOVER_MSG3,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'start',
  },
  {
    element_id: GroupNodeID.FirstGroup,
    popover_title: 'Attach policies & users',
    popover_content: POPOVER_MSG4,
    show_next_button: false,
    show_close_button: true,
    popover_placement: 'top',
  },
  {
    element_id: UserNodeID.FirstUser,
    popover_title: 'Nice! 🔥',
    popover_content: POPOVER_MSG5,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'start',
  },
  {
    element_id: GroupNodeID.FirstGroup,
    popover_title: "Let's add another user",
    popover_content: POPOVER_MSG6,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'start',
  },
  {
    element_id: UserNodeID.SecondUser,
    popover_title: 'All set! 🎉',
    popover_content: POPOVER_MSG7,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'start',
  },
];
