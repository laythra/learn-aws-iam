import { GroupNodeID, UserNodeID } from '../types/node-id-enums';
import { ElementID } from '@/config/element-ids';
import type { PopoverTutorialMessage } from '@/levels/types/tutorial-message-types';

const POPOVER_MSG1 = `
  Notice how this user has several **IAM Policies** attached to it.

  We're going to simplify this by moving those permissions into an **IAM Group**.

  Click ***NEXT*** to get started.
`;

const POPOVER_MSG3 = ``;

const POPOVER_MSG2 = `
  Let's create an **IAM Group**.
`;

const POPOVER_MSG4 = `
  ::badge[CORE]:: You can attach both policies and users to your **IAM Group**.
`;

const POPOVER_MSG5 = `
  Notice how the **IAM User** automatically inherited the policies attached to the **group**.
`;

const POPOVER_MSG6 = `
  Let's take it further by adding another **user** to the **group**.
  Create a new user and connect it to the group.
`;

const POPOVER_MSG7 = `
  Your new user immediately inherited all the **policies** from the **group** —
  no need to attach them individually. Onboarding new team members just got a lot easier!
`;

export const POPOVER_TUTORIAL_MESSAGES: PopoverTutorialMessage[] = [
  {
    element_id: UserNodeID.FirstUser,
    popover_title: 'Current User Permissions',
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
    popover_title: `Give your group a name`,
    popover_content: POPOVER_MSG3,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'start',
  },
  {
    element_id: GroupNodeID.FirstGroup,
    popover_title: `Attaching Policies & Users`,
    popover_content: POPOVER_MSG4,
    show_next_button: false,
    show_close_button: true,
    popover_placement: 'top',
  },
  {
    element_id: UserNodeID.FirstUser,
    popover_title: `Nice! 🔥`,
    popover_content: POPOVER_MSG5,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'start',
  },
  {
    element_id: GroupNodeID.FirstGroup,
    popover_title: `Let's add another user`,
    popover_content: POPOVER_MSG6,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'start',
  },
  {
    element_id: UserNodeID.SecondUser,
    popover_title: `Level 2 Complete! 🎉`,
    popover_content: POPOVER_MSG7,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'start',
  },
];
