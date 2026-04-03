import { PopupTutorialMessage } from '@/types/tutorial-message-types';

const POPUP_MSG1 = `
  This interactive tutorial guides you through
  **AWS Identity and Access Management (IAM)**, from the basics to more advanced concepts.

  It doesn't aim to cover every IAM feature,
  instead, it focuses on the core ideas you'll need to confidently tackle real-world scenarios.

  You'll create users, manage permissions, and write policies
  through hands-on challenges along the way.

  Each level introduces key IAM concepts and builds on the ones before it.

  Let's dive in.
`;

const POPUP_MSG2 = `
  Nice work completing the first level!
  Here's what we covered:
  * The fundamentals of **IAM Users**, **IAM Policies**, and **AWS Resources**
  * How **IAM Policies** control access to resources
  * Attaching **IAM Policies** to **IAM Users** to grant permissions

  In the next level,
  we'll explore **IAM Groups** and how they help you manage permissions at scale.
`;

export const POPUP_TUTORIAL_MESSAGES: PopupTutorialMessage[] = [
  {
    title: 'Learn AWS IAM in a fun way 🛡️',
    content: POPUP_MSG1,
  },
  {
    title: 'Level 1 completed! 🔥',
    content: POPUP_MSG2,
    go_to_next_level_button: true,
  },
];
