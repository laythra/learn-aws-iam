import _ from 'lodash';

import { PopupTutorialMessage } from '@/machines/types/tutorial-message-types';

const POPUP_MSG1 = `
  This interactive tutorial is a practical journey through
  ***AWS Identity and Access Management (IAM)***—starting with
  the basics and progressing to more advanced concepts.|lg

  It’s not a complete reference to everything ***IAM*** can do,
  but it covers the core ideas you’ll need to tackle real-world scenarios with confidence.|lg

  You’ll create **users**, manage **permissions**, and craft **policies**,
  all while working through interactive challenges and clear explanations.

  Each level builds on key IAM concepts, helping you sharpen your skills step by step.

  Jump in and explore AWS IAM the interactive way.
`;

const POPUP_MSG2 = `
  Congrats on finishing the first level of our long journey!
  We have covered the following basics of IAM:|lg
  * Learning about **IAM Users**, **IAM Policies**, and **AWS Resources**
  * Understanding the basic role of **IAM Policies** in managing permissions
  * Attaching **IAM Policies** to **IAM Users** in order to grant the disignated permissions

  We'll learn about **IAM Groups** in the next level and how they can help us scale things up!|lg
`;

export const POPUP_TUTORIAL_MESSAGES: PopupTutorialMessage[] = [
  {
    id: _.uniqueId('popup-tutorial-'),
    title: 'Learn AWS IAM in a fun way',
    content: POPUP_MSG1,
  },
  {
    id: _.uniqueId('popup-tutorial-'),
    title: 'Level 1 completed! 🔥',
    content: POPUP_MSG2,
    go_to_next_level_button: true,
  },
];
