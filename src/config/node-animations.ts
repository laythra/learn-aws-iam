import _ from 'lodash';

import { theme } from '@/theme';
import { IAMNodeAnimationConfig } from '@/types/iam-node-types';

export enum NODE_ANIMATION_ID {
  ShimmerBackground = 'shimmer-background',
  ShimmeringLight = 'shimmering-light',
}

const iamNodeWidthInPixels = theme.sizes.iamNodeWidthInPixels;

const NODE_ANIMATIONS: Record<NODE_ANIMATION_ID, IAMNodeAnimationConfig> = {
  [NODE_ANIMATION_ID.ShimmerBackground]: [
    {
      element_class: '.shimmer',
      keyframes: { x: ['-100%', '100%'] },
      options: { duration: 2.5, repeat: 4, ease: 'easeOut' },
    },
  ],
  [NODE_ANIMATION_ID.ShimmeringLight]: [
    {
      element_class: '.line',
      keyframes: {
        x: [-20, iamNodeWidthInPixels + 20 - 50, iamNodeWidthInPixels + 20 - 50, -20, -20],
        rotate: [0, 0, 180, 180, 180],
        scaleX: [1, 4, 1, 4, 1, 0, 0],
      },
      options: {
        duration: 3,
        repeat: 4,
        ease: 'linear',
      },
    },
  ],
};

export function getNodeAnimations(...animationIds: NODE_ANIMATION_ID[]): ReturnType<typeof _.pick> {
  return _.pick(NODE_ANIMATIONS, ...animationIds);
}
