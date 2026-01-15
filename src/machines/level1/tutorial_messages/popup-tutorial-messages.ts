import { PopupTutorialMessage } from '@/machines/types/tutorial-message-types';

const POPUP_MSG1 = `
  This interactive tutorial is a practical journey through
  ***AWS Identity and Access Management (IAM)***—starting with
  the basics and progressing to more advanced concepts.|lg

  It’s not a complete reference to everything ***IAM*** can do,
  but it covers the core ideas you’ll need to tackle real-world scenarios with confidence.|lg

  You’ll create **users**, manage **permissions**, and craft **policies**,
  all while working through interactive challenges and clear explanations.|lg

  Each level builds on key IAM concepts, helping you sharpen your skills step by step.|lg

  &nbsp;

  Jump in and explore AWS IAM the interactive way.|lg
`;

const POPUP_MSG2 = `
  Nice! Level 1 is done. Here's what you just nailed:|lg
  * **IAM Users**, **IAM Policies**, and **AWS Resources** basics
  * How policies control access
  * Attaching a policy to a user to grant permissions

  &nbsp;

  Next up: **IAM Groups** and how they make scaling access way easier.|lg
`;

export const POPUP_TUTORIAL_MESSAGES: PopupTutorialMessage[] = [
  {
    title: 'Learn AWS IAM the fun way',
    content: POPUP_MSG1,
  },
  {
    title: 'Level 1 completed! 🔥',
    content: POPUP_MSG2,
    go_to_next_level_button: true,
  },
];
