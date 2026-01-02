import { PolicyNodeID, RoleNodeID, UserNodeID } from '../types/node-id-enums';
import type { PopoverTutorialMessage } from '@/machines/types/tutorial-message-types';

const POPOVER_MSG1 = `
  The existing role allows users to deploy the Slack Crashlytics Notifier Service,
  as well as read the Slack Integration Secret.
`;

const POPOVER_MSG2 = `
  View the policy's content and **click on the Edit button on the right side to edit it**.
`;

const POPOVER_MSG3 = ``;

const POPOVER_MSG4 = `
  Let's edit the policy again to use the \`role\` tag instead of the username.
`;

const POPOVER_MSG5 = `
  Great Job. You've utilized the \`role\` tag to restrict access to the Slack Integration Secret.
`;

export const POPOVER_TUTORIAL_MESSAGES: PopoverTutorialMessage[] = [
  {
    element_id: RoleNodeID.SlackCodeDeployRole,
    popover_title: 'Current Role',
    popover_content: POPOVER_MSG1,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    // TODO: Add an image here
    element_id: PolicyNodeID.SlackServiceManagePolicy,
    popover_title: 'Editing the Policy',
    popover_content: POPOVER_MSG2,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: UserNodeID.JuniorBruce,
    popover_title: 'View the Tags 🏷️',
    popover_content: POPOVER_MSG3,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: PolicyNodeID.SlackServiceManagePolicy,
    popover_title: 'Editing the Policy',
    popover_content: POPOVER_MSG4,
    show_next_button: false,
    show_close_button: false,
    popover_placement: 'top',
  },
  {
    element_id: PolicyNodeID.SlackServiceManagePolicy,
    popover_title: 'Mission Accomplished! 🎉',
    popover_content: POPOVER_MSG5,
    show_next_button: true,
    show_close_button: false,
    popover_placement: 'top',
  },
];
