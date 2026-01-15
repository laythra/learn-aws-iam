import { PolicyNodeID, RoleNodeID, UserNodeID } from '../types/node-id-enums';
import type { PopoverTutorialMessage } from '@/machines/types/tutorial-message-types';

const POPOVER_MSG1 = `
  This role can deploy the Slack Crashlytics Notifier service
  and read the Slack Integration Secret.
`;

const POPOVER_MSG2 = `
  Open the policy content and click the edit :icon[PencilSquareIcon]: button on the right.
`;

const POPOVER_MSG3 = `
  Check the user’s tags by clicking :icon[TagIcon]:.
`;

const POPOVER_MSG4 = `
  Let’s edit the policy again to use the **role** tag instead of the username.
`;

const POPOVER_MSG5 = `
  Nice work! Access is now restricted using the \`role\` tag.
`;

export const POPOVER_TUTORIAL_MESSAGES: PopoverTutorialMessage[] = [
  {
    element_id: RoleNodeID.SlackCodeDeployRole,
    popover_title: 'Current role',
    popover_content: POPOVER_MSG1,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    // TODO: Add an image here
    element_id: PolicyNodeID.SlackServiceManagePolicy,
    popover_title: 'Editing the policy',
    popover_content: POPOVER_MSG2,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: UserNodeID.JuniorBruce,
    popover_title: 'View the tags 🏷️',
    popover_content: POPOVER_MSG3,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: PolicyNodeID.SlackServiceManagePolicy,
    popover_title: 'Editing the policy',
    popover_content: POPOVER_MSG4,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: PolicyNodeID.SlackServiceManagePolicy,
    popover_title: 'Mission accomplished! 🎉',
    popover_content: POPOVER_MSG5,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
];
