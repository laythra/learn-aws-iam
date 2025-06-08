import { GroupNodeID, UserNodeID } from '../types/node-id-enums';
import { ElementID } from '@/config/element-ids';
import type { PopoverTutorialMessage } from '@/machines/types';

const POPOVER_MSG1 = `
  Notice how this user has a bunch of **IAM Policies** attached to it.

  We would like to simplify this by creating an **IAM Group**.

  Click *NEXT* to begin anew.
`;

const POPOVER_MSG3 = ``;

const POPOVER_MSG2 = `
  Let's create an **IAM Group**
`;

const POPOVER_MSG4 = `
  Remember, you can attach policies and users to your **IAM Group**.
`;

const POPOVER_MSG5 = `
  Notice how the **IAM User** inherited the policies attached to the **group**.
`;

const POPOVER_MSG6 = `
  Let's scale things more by adding another **user** to the **group**.
  Simply create a new user and attach it to the group.
`;

const POPOVER_MSG7 = `
  Your new user directly inherited the **policies** attached to the **group** in one go.
  Adding team members is now a breeze! no need to attach **policies** to each **user** individually.
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
    popover_title: `It goes without saying, but each group must have a name`,
    popover_content: POPOVER_MSG3,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'start',
  },
  {
    element_id: GroupNodeID.FirstGroup,
    popover_title: `Attaching Policies/Users`,
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
    show_close_button: true,
    popover_placement: 'start',
  },
  {
    element_id: GroupNodeID.FirstGroup,
    popover_title: `Let\'s add another user`,
    popover_content: POPOVER_MSG6,
    show_next_button: true,
    show_close_button: true,
    popover_placement: 'start',
  },
  {
    element_id: UserNodeID.SecondUser,
    popover_title: `There you have it! 🎉`,
    popover_content: POPOVER_MSG7,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'start',
  },
];
