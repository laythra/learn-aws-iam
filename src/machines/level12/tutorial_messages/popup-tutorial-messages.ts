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
  **Service Control Policies (SCPs)** let AWS Organizations cap permissions
  across multiple accounts.|lg

  SCPs set the *maximum* permissions accounts can ever get,
  even if IAM policies try to grant more.|lg

  Apply SCPs to **OUs** or specific accounts to enforce security at scale.|lg

  Reminder: SCPs **don’t grant** permissions—they only restrict what’s allowed.|lg
`;

const POPUP_MSG3 = `
  This is the ultimate challenge. You’ll combine users, groups, roles,
  policies, permission boundaries, and SCPs to hit complex requirements.|lg

  The right panel has objectives, hints, and references.|lg

  Good luck! 🌟|lg
`;

const POPUP_MSG4 = `
  You did it. 🎉|lg

  You’ve conquered users, groups, roles, policies, permission boundaries, and SCPs.|lg

  **Level 12 complete—and the full IAM journey is done.**|lg

  Keep practicing: IAM is central to AWS security, and real-world work will make
  these skills stick.|lg

  When you’re ready, explore topics like **identity federation** and
  **attribute-based access control (ABAC)**.|lg

  **Now go build something awesome. The cloud awaits! 🚀**|lg
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
    title: 'The ultimate challenge awaits',
    content: POPUP_MSG3,
  },
  {
    title: 'Officially an IAM master 🎓',
    content: POPUP_MSG4,
    go_to_next_level_button: true,
  },
];
