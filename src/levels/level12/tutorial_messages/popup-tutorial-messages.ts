import { PopupTutorialMessage } from '@/types/tutorial-message-types';
const POPUP_MSG1 = `
  You made it to Level 12, the final level! 🎉

  This level introduces **Service Control Policies (SCPs)**,
  a policy type that acts as a guardrail across an AWS Organization.
  You'll also put together everything from the previous levels in one final challenge.

  Get ready to bring it all together!
`;

const POPUP_MSG2 = `
  **Service Control Policies (SCPs)** are a policy type used in AWS Organizations
  to set guardrails/maximum permissions across multiple AWS accounts.

  An SCP defines the maximum permissions that accounts under it can have.
  Even if an IAM policy explicitly allows an action, the SCP can block it.

  You attach SCPs to organizational units (OUs) or individual accounts,
  so no user or role in those accounts can exceed the boundaries you set.

  > |color(warning)
  > ::badge[WARNING]:: Just like **Permission Boundaries**, **Service Control Policies (SCPs)**
  > don't grant permissions. They merely restrict what other policies are allowed to grant.
`;

const POPUP_MSG3 = `
  Everything we've learned so far will be put to the test in this ultimate challenge.
  You'll need to design and implement a comprehensive IAM strategy that incorporates
  **users**, **groups**, **roles**, **policies**, **permission boundaries**,
  and **SCPs** to meet complex requirements.

  The right side panel contains all the information you'll need to succeed,
  including objectives, hints, and resources.

  Good luck, and may your IAM mastery shine through! 🌟|xl
`;

const POPUP_MSG4 = `
  Congratulations! You've now mastered AWS IAM, conquering **users**,
  **groups**, **roles**, **identity policies**,
  **permission boundaries**, and many more!

  **You've successfully completed Level 12 and the full AWS IAM learning journey!** 🎉

  You now have a strong foundation in AWS IAM fundamentals and security best practices.
  IAM is one of the most critical services for AWS security,
  so continue building on this knowledge through hands-on practice and real-world application.

  Your learning doesn't have to stop here - there's a whole world of advanced IAM topics
  waiting to be explored, including **identity federation**, **advanced ABAC beyond tags**
  (like SAML attributes and session policies), and **sophisticated access management strategies**.

  You should feel proud of this accomplishment and confident in your ability to
  design and implement secure AWS access controls. Keep experimenting,
  building and sharing your knowledge with others.

  Ready to put your IAM expertise to work? The cloud awaits! 🚀
`;

export const POPUP_TUTORIAL_MESSAGES: PopupTutorialMessage[] = [
  {
    title: 'Welcome to Level 12',
    content: POPUP_MSG1,
  },
  {
    title: 'Understanding SCPs',
    content: POPUP_MSG2,
  },
  {
    title: 'The Ultimate Challenge Awaits',
    content: POPUP_MSG3,
  },
  {
    title: 'Officially an IAM Master 🎓',
    content: POPUP_MSG4,
    go_to_next_level_button: true,
  },
];
