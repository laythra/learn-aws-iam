import { PopupTutorialMessage } from '@/machines/types';
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

export const POPUP_TUTORIAL_MESSAGES: PopupTutorialMessage[] = [
  {
    title: 'Welcome to Level 12',
    content: POPUP_MSG1,
  },
  {
    title: 'Understanding SCPs',
    content: POPUP_MSG2,
  },
];
