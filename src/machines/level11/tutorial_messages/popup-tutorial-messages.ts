import { PopupTutorialMessage } from '@/machines/types';
const POPUP_MSG1 = `
   It's been quite the ride so far, hasn't it? 🚀|lg

   We'll be diving into more advanced concepts that allow us to guard and
   control access to our resources more effectively, starting with **Permission Boundaries**.|lg

  These boundaries act as a safety net, ensuring that even if an IAM entity has permissions,
  they cannot exceed the limits set by the boundary policy.|lg
`;

const POPUP_MSG2 = `
  Permission boundaries are a powerful tool in IAM that allow you to set the maximum permissions
  an IAM entity (like a user or role) can have, regardless of the policies attached to it.|lg

  They act as a filter, ensuring that even if an entity has permissions granted by other policies,
  they cannot exceed the limits defined by the boundary policy.|lg

  This is particularly useful for controlling access
  to sensitive resources and ensuring compliance with security policies.|lg
`;

const POPUP_MSG3 = `
  So permission boundaries are nice, but why would we want to cap the maximum permissions
  a user/role can have if we can simply just limit the permissions they have in the first place?|lg

  Well, permission boundaries are especially useful in scenarios where you want to delegate
  permission management to other users or teams, but still want to maintain control over
  the maximum permissions that can be granted.
  We'll see more of this in the upcoming section of this level|lg
`;

const POPUP_MSG4 = `
  For this part of the level, you'll be an admin who wants to delegate permission management
  to other developers on your team in order to scale and move faster. You objectives are:|lg

  * Create a permission boundary which limits users
  to reading secrets tagged with their team name, ie: \`team: \${aws:PrincipalTag/team}\`
  * Allow users tagged with **"role:senior"** to create permission policies as they like
  * Allow the same users to attach these permission policies to roles that **ONLY**
    have the created permission boundary attached
`;

export const POPUP_TUTORIAL_MESSAGES: PopupTutorialMessage[] = [
  {
    title: 'Level 11: Permission Boundaries',
    content: POPUP_MSG1,
  },
  {
    title: 'How permission boundaries work',
    content: POPUP_MSG2,
  },
  {
    title: 'The Power Of Permission Boundaries',
    content: POPUP_MSG3,
  },
  {
    title: 'Your Objectives',
    content: POPUP_MSG4,
  },
];
