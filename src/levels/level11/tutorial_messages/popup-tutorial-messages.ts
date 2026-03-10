import { PopupTutorialMessage } from '@/levels/types/tutorial-message-types';
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

  ::badge[RULE]:: Permission boundaries **only limit** — they don't grant permissions on their own.
  An entity still needs an identity policy that explicitly allows the action.|lg
`;

const POPUP_MSG3 = `
  Why use permission boundaries if we can just limit permissions directly?|lg

  They're essential when delegating permission management—letting others assign permissions,
  but always keeping a strict upper limit on what can be granted.|lg
`;

const POPUP_MSG4 = `
  For this part of the level, you'll be an admin who wants to delegate permission management
  to other developers on your team in order to scale and move faster. Your objectives are:|lg

  * Create a permission boundary that limits secret access to secrets tagged with
    the requester's own \`team\` tag, ie: \`team: \${aws:PrincipalTag/team}\`
  * Create a delegation policy that allows attaching policies **only** to roles
    that already have that permission boundary attached
`;

const POPUP_MSG5 = `
  Congratulations! Reaching this far is a significant achievement. 🎉|lg

  Permission boundaries are a powerful tool in IAM that allow you to set
  the maximum permissions an entity can have.
  You can tell by now that everything we've learned so far can
  be used to construct complex scenarios, just like the one you just went through.|lg

  In the upcoming (and final) level, we will
  introduce **Service Control Policies** (a very simple concept)
  and do a quick recap of everything we learned so far.|lg

  Give yourself a pat on the back for making it this far! Let's finish this.|lg
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
  {
    title: 'Level Finished! 🔥',
    content: POPUP_MSG5,
    go_to_next_level_button: true,
  },
];
