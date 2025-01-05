import { PopupTutorialMessage } from '@/machines/types';

const POPUP_MSG1 = `
  Let’s dive in and make managing AWS IAM both fun and effective!|lg

  Here’s the world’s most comprehensive vice interactive tutorial
  for **AWS Identity and Access Management (IAM)**.|lg

  You’ll be able to make the most out of this tool even if you’re a novice or have some experience
  as it allows for a hands on interactive experience alongside
  detailed explanations and challenges to work with.|lg

  Over the course of this interactive journey,
  you will learn an array of skills including creating users,
  managing permissions, forming policies and above all – solving multifaceted real life situations.
  These constructs are brilliantly crafted allowing you to develop in
  level and introducing you to essential concepts of IAM at each level.|lg

  So without further ado, allow yourself to enjoy an effective experience
  for managing **AWS IAM**!|lg
`;

export const POPUP_TUTORIAL_MESSAGES: PopupTutorialMessage[] = [
  {
    title: 'Learn AWS IAM in a fun way',
    content: POPUP_MSG1,
  },
];
