import { LevelsProgressionContext } from '@/components/providers/level-actor-contexts';
import { ElementID } from '@/config/element-ids';

interface AnimateRedDotContext {
  isRedDotEnabledForElement: (elementId: ElementID) => boolean;
}

interface UseAnimatedRedDotOptions {
  elementIds: ElementID[];
}

export const useAnimatedRedDot = ({
  elementIds,
}: UseAnimatedRedDotOptions): AnimateRedDotContext => {
  const redDotComponents = LevelsProgressionContext().useSelector(
    state => state.context.elements_with_animated_red_dot ?? []
  );

  const elementsWithRedDotEnabled = elementIds.reduce(
    (memo, elementId) => {
      memo[elementId] = redDotComponents.includes(elementId);
      return memo;
    },
    {} as Record<ElementID, boolean>
  );

  const isRedDotEnabledForElement = (elementId: ElementID): boolean => {
    return elementsWithRedDotEnabled[elementId];
  };

  return { isRedDotEnabledForElement };
};
