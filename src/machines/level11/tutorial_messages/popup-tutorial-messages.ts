import { PopupTutorialMessage } from '@/machines/types/tutorial-message-types';
const POPUP_MSG1 = `
   It’s been a ride. 🚀|lg

   Now we’re getting into **Permission Boundaries**—a way to cap permissions
   so entities can’t go beyond a defined limit.|lg
`;

const POPUP_MSG2 = `
  Permission boundaries set the **maximum** permissions a user/role can have,
  no matter what other policies grant.|lg

  Think of them as a filter: even if another policy allows something,
  the boundary can still block it.|lg
`;

const POPUP_MSG3 = `
  Why not just limit permissions directly?|lg

  Boundaries are perfect when **delegating** permission management—
  others can grant access, but only within your safe limits.|lg
`;

const POPUP_MSG4 = `
For this part, you’re an admin delegating permission management.
Your objectives:|lg

  * Create a permission boundary that limits users to reading secrets tagged
    with their team name (e.g., \`team: \${aws:PrincipalTag/team}\`).
  * Allow users tagged **"role:senior"** to create permission policies.
  * Allow those users to attach policies only to roles that have
    **the boundary attached**.
`;

const POPUP_MSG5 = `
  Nice work getting this far. 🎉|lg

  Permission boundaries are powerful, and you just used them in a real scenario.|lg

  Final level next: **Service Control Policies** and a quick recap.|lg

  Almost there—let’s wrap it up strong.|lg
`;

export const POPUP_TUTORIAL_MESSAGES: PopupTutorialMessage[] = [
  {
    title: 'Level 11: Permission boundaries',
    content: POPUP_MSG1,
  },
  {
    title: 'How permission boundaries work',
    content: POPUP_MSG2,
  },
  {
    title: 'The power of permission boundaries',
    content: POPUP_MSG3,
  },
  {
    title: 'Your objectives',
    content: POPUP_MSG4,
  },
  {
    title: 'Level finished! 🔥',
    content: POPUP_MSG5,
    go_to_next_level_button: true,
  },
];
