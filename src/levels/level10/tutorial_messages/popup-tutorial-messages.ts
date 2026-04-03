import { PopupTutorialMessage } from '@/types/tutorial-message-types';
const POPUP_MSG1 = `
  So far in TBAC, we've worked with two types of tag-based conditions:

  * **Principal Tags** (\`aws:PrincipalTag\`):
  tags on the IAM user making the request.

  * **Resource Tags** (\`aws:ResourceTag\`):
  tags on the resource being accessed.

  This level adds a third: **Request Tags**: tags carried by the API call itself.

  * **Request Tags** (\`aws:RequestTag\`) are tags included in an API request,
  letting you enforce that resources are tagged correctly **before they even exist**.
`;

const POPUP_MSG2 = `
 For this level, you'll be the DevOps engineer at a fintech company with three teams
 (**payments**, **analytics**, **compliance**) that each manage their own EC2 instances
 across dev/staging/prod environments.

 All three teams belong to a single **engineering** group — but that's not what controls access.
 Each user carries an \`application\` tag that identifies their team,
 and your policies will use that tag to enforce:

* Teams can only access and manage their own instances —
 the compliance team cannot stop the payments team's instance

* Consistent tagging is enforced for cost tracking and compliance purposes
`;

const POPUP_MSG3 = `
  The first policy needs three statements — the third is pre-filled for you.

  **1. Tag Creation Statement**

  Allows teams to create tags only when launching a new EC2 instance.

  **2. EC2 Instance Launch Statement**

  Allows teams to launch EC2 instances, while **enforcing** the presence of the following tags:

  * \`application\` - Must match the principal's application tag
  * \`environment\` - Must be one of: \`dev\`, \`staging\`, or \`prod\`
  * \`Name\` - Optional but recommended; any descriptive label for the instance.
    If included, it must be one of the allowed tag keys.
`;

const POPUP_MSG4 = `
  That was a tough level. Give yourself a well-earned pat on the back! 🎉

  You've now mastered **Tag-Based Access Control (TBAC)**,
  and not only that, you've shown real skill in crafting complex IAM policies.

  In this level, we explored **Request Tags** and how they can
  be used to manage access based on the tags attached to the request itself.

  We're nearing the end of our journey.
  Next up, we'll dive into a powerful concept called **Permission Boundaries**,
  which help define the maximum permissions an IAM entity can receive.

  You're doing great. Let's finish strong! 💪
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
