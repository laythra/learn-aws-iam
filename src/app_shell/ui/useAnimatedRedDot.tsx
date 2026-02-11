import { useLevelSelector } from '@/app_shell/runtime/level-runtime';
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
  const redDotComponents = useLevelSelector(
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
