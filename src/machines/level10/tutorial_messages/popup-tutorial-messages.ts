import { PopupTutorialMessage } from '@/machines/types/tutorial-message-types';
const POPUP_MSG1 = `
  We've been exploring **Tag Based Access Control (TBAC)** so far,
  but there's still much more to discover!
  The only type of tags we've worked with until now are **Resource Tags**,
  which are tags that are already attached to the resources we want to control access to.|lg

  This level will introduce **Request Tags**, which is a fundamental concept in
  TBAC that provides even greater flexibility in controlling access to resources.|lg

  * **Resources Tags** are tags that are already attached to the resources we wish to control
  access to.|lg

  * **Request Tags** are tags that we can mandate requests with,
  and use to control access to resources based on the tags that are attached to the request.|lg
`;

const POPUP_MSG2 = `
 For this level, you'll be the DevOps engineer at a fintech company with three teams
 (***payments***, ***analytics***, ***compliance***) that each manage their own databases
 across dev/staging/prod environments. Your goal is to ensure:|lg

* Teams can only access and manage their own databases,
 for example: The compliance team cannot modify the payments team's database|lg

* Consistent tagging is enforced for cost tracking and compliance purposes|lg
`;

const POPUP_MSG3 = `
To achieve this level of control, we need to define a single policy with two distinct statements:|lg

  **1. Tag Creation Statement**|lg

  Allows teams to create tags **only** when creating a new RDS instance|lg

  **2. RDS Instance Creation Statement**|lg

  Allows teams to create RDS instances, while **enforcing** the presence of the following tags:

  * \`team\` - Must match the principal's team name
  * \`environment\` - Must be one of: \`dev\`, \`staging\`, or \`prod\`
  * \`name\` - Can be any descriptive name for the RDS instance
`;

const POPUP_MSG4 = `
  That was a tough level, give yourself a well-earned pat on the back! 🎉|lg

  You’ve now mastered ***Tag-Based Access Control (TBAC)***,
  and not only that, you’ve shown real skill in crafting complex IAM policies.|lg

  In this level, we explored *Request Tags* and how they can
  be used to manage access based on the tags attached to the request itself.|lg

  We're nearing the end of our journey.
  Next up, we’ll dive into a powerful concept called **Permission Boundaries**,
  which help define the maximum permissions an IAM entity can receive.|lg

  You're doing great. Let’s finish strong! 💪|lg
`;

export const POPUP_TUTORIAL_MESSAGES: PopupTutorialMessage[] = [
  {
    title: 'Level 10: Request Tags',
    content: POPUP_MSG1,
  },
  {
    title: 'Your role as a DevOps Engineer',
    content: POPUP_MSG2,
  },
  {
    title: 'Level 10 Objectives',
    content: POPUP_MSG3,
  },
  {
    title: 'Level 10 Completed! ✅',
    content: POPUP_MSG4,
    go_to_next_level_button: true,
  },
];
