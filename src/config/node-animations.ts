import { DOMKeyframesDefinition, DynamicAnimationOptions } from 'framer-motion';
import _ from 'lodash';

export enum NODE_ANIMATION_ID {
  ShimmerBackground = 'shimmer-background',
}

const NODE_ANIMATIONS: Record<
  NODE_ANIMATION_ID,
  { keyframes: DOMKeyframesDefinition; options: DynamicAnimationOptions }
> = {
  [NODE_ANIMATION_ID.ShimmerBackground]: {
    keyframes: { x: ['-100%', '100%'] },
    options: { duration: 1.5, repeat: 1, ease: 'linear' },
  },
};

export function getNodeAnimations(...animationIds: NODE_ANIMATION_ID[]): ReturnType<typeof _.pick> {
  return _.pick(NODE_ANIMATIONS, ...animationIds);
}
