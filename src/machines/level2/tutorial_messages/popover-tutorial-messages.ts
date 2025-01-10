import { GroupNodeID, UserNodeID } from '../types/node-id-enums';
import type { PopoverTutorialMessage } from '@/machines/types';
import { ElementID } from '@/config/element-ids';

export const POPOVER_TUTORIAL_MESSAGES: PopoverTutorialMessage[] = [
  {
    element_id: ElementID.NewEntityBtn,
    popover_title: 'IAM Groups',
    popover_content: `Let's create an IAM group`,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: ElementID.IAMIdentitySelectorTypeForCreation,
    popover_title: `Select the group type`,
    popover_content: ``,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: ElementID.IAMIdentityNameInput,
    popover_title: `It goes without saying, but each group needs a name`,
    popover_content: ``,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'start',
  },
  {
    element_id: GroupNodeID.FirstGroup,
    popover_title: `Attaching Policies/Users`,
    popover_content: `
      Remember, you can attach policies and users to your IAM group.
    `,
    show_next_button: false,
    show_close_button: true,
    popover_placement: 'start',
  },
  {
    element_id: UserNodeID.FirstUser,
    popover_title: `Nice! 🔥`,
    popover_content: `
      Notice how the IAM user inherited the policies attached to the group.
    `,
    show_next_button: true,
    show_close_button: true,
    popover_placement: 'start',
  },
  {
    element_id: GroupNodeID.FirstGroup,
    popover_title: `Let\'s add another user`,
    popover_content: `
      Let's scale things more by adding another user to the group.
      Simply create a new user and attach it to the group.
    `,
    show_next_button: true,
    show_close_button: true,
    popover_placement: 'start',
  },
  {
    element_id: UserNodeID.SecondUser,
    popover_title: `There you have it! 🎉`,
    popover_content: `
      Your new user directly inherited the policies attached to the group in one go.
      Adding team members is now a breeze!
    `,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'start',
  },
];
