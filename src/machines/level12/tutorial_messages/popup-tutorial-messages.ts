import { PopupTutorialMessage } from '@/machines/types/tutorial-message-types';
const POPUP_MSG1 = `
  Congratulations on reaching Level 12, the grand finale of your AWS IAM journey! 🎉|lg

  As we wrap up, this level serves as both a celebration of your progress and a final challenge.
  We'll explore **Service Control Policies (SCPs)**—the organizational guard rails
  that complement what you've learned about Permission Boundaries.|lg

  Get ready to apply everything you've mastered so far,
  as you take on a challenge that brings together all the key concepts from our adventure.|lg
`;

const POPUP_MSG2 = `
  **Service Control Policies (SCPs)** are essential tools in AWS Organizations for centrally
  controlling permissions across multiple AWS accounts.|lg

  SCPs set the upper limit on permissions that accounts in your
  organization can receive, regardless of what individual IAM policies allow.|lg

  By applying SCPs to **organizational units (OUs)** or specific accounts,
  you ensure that no user or role can exceed the boundaries you define,
  supporting security and compliance at scale.|lg

  Keep in mind: SCPs do not grant permissions themselves—they only
  restrict what can be allowed by other policies.|lg
`;

const POPUP_MSG3 = `
  Everything we've learned so far will be put to the test in this ultimate challenge.
  You'll need to design and implement a comprehensive IAM strategy that incorporates
  users, groups, roles, policies, permission boundaries, and SCPs to meet complex requirements.|lg

  The right side panel contains all the information you'll need to succeed,
  including objectives, hints, and resources.|lg

  Good luck, and may your IAM mastery shine through! 🌟|xl
`;

const POPUP_MSG4 = `
  Congratulations! You've now mastered AWS IAM, conquering users, groups, roles, policies,
  permission boundaries, and many more!|lg

  **You've successfully completed Level 12 and the full AWS IAM learning journey!** 🎉|lg

  You now have a strong foundation in AWS IAM fundamentals and security best practices.
  IAM is one of the most critical services for AWS security,
  so continue building on this knowledge through hands-on practice and real-world application.|lg

  Your learning doesn't have to stop here - there's a whole world of advanced IAM topics
  waiting to be explored, including ***identity federation***, ***attribute-based access control***,
  and ***sophisticated access management strategies***.|lg

  You should feel proud of this accomplishment and confident in your ability to
  design and implement secure AWS access controls. Keep experimenting,
  building and sharing your knowledge with others.|lg

  ***Ready to put your IAM expertise to work? The cloud awaits! 🚀***|lg
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
    title: 'Officialy an IAM Master 🔥',
    content: POPUP_MSG4,
  },
];
