import { PopupTutorialMessage } from '@/machines/types/tutorial-message-types';
const POPUP_MSG1 = `
  We’ve been working with **Tag-Based Access Control (TBAC)**,
  mostly using **resource tags** so far.|lg

  This level introduces **request tags**—tags that come in *with the request*
  and can be required to perform actions.|lg

  * **Resource tags** already exist on the resources.
  * **Request tags** are supplied in the request and can be enforced by policy.
`;

const POPUP_MSG2 = `
 For this level, you’re the DevOps engineer at a fintech company with three teams
 (**payments**, **analytics**, **compliance**). Each team manages databases across
 dev/staging/prod. Your goals:|lg

* Teams can only access and manage their own databases.
* Consistent tagging is enforced for cost tracking and compliance.|lg
`;

const POPUP_MSG3 = `
We’ll solve this with a single policy containing two statements:|lg

  **1. Tag creation statement**|lg

  Lets teams create tags **only** when creating a new RDS instance.|lg

  **2. RDS instance creation statement**|lg

  Allows RDS creation but **requires** these tags:

  * \`team\` — must match the principal’s team name
  * \`environment\` — must be \`dev\`, \`staging\`, or \`prod\`
  * \`name\` — any descriptive name
`;

const POPUP_MSG4 = `
  That was a tough one—nice job. 🎉|lg

  You’ve got solid **TBAC** skills now and can write some seriously complex policies.|lg

  This level focused on **request tags** and enforcing them in policies.|lg

  We’re close to the finish line. Next up: **Permission Boundaries**—
  how to cap the maximum permissions an IAM entity can get.|lg

  Let’s finish strong. 💪|lg
`;

export const POPUP_TUTORIAL_MESSAGES: PopupTutorialMessage[] = [
  {
    title: 'Level 10: Request tags',
    content: POPUP_MSG1,
  },
  {
    title: 'Your role as a DevOps engineer',
    content: POPUP_MSG2,
  },
  {
    title: 'Level 10 objectives',
    content: POPUP_MSG3,
  },
  {
    title: 'Level 10 completed! ✅',
    content: POPUP_MSG4,
    go_to_next_level_button: true,
  },
];
