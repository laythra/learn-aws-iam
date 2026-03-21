import { PolicyNodeID, RoleNodeID, UserNodeID } from '../types/node-ids';
import type { PopoverTutorialMessage } from '@/levels/types/tutorial-message-types';

const POPOVER_MSG1 = `
  This role currently lets all assigned users deploy the Slack alerting service
  and read the Slack integration secret.
`;

const POPOVER_MSG2 = `
  Open the policy content with the \`::icon[CodeBracketIcon]::\` button,
  and click \`::icon[PencilSquareIcon]::\` to edit the policy.
`;

const POPOVER_MSG3 = `
  Open this user's tags \`::icon[TagIcon]::\` so we can use tag values in the next policy update.
`;

const POPOVER_MSG4 = `
  Let's edit the policy again and switch from username matching
  to checking the principal tag \`role\`.
`;

const POPOVER_MSG5 = `
  Great job. You used the \`role\` tag to restrict access to the Slack integration secret.
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
    element_id: UserNodeID.JuniorAlex,
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
