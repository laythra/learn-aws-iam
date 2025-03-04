import { LevelsProgressionContext } from '@/components/providers/LevelsProgressionProvider';
import { ElementID } from '@/config/element-ids';

interface AnimateRedDotContext {
  isRedDotOn: Record<ElementID, boolean>;
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

  const isOn = elementIds.reduce(
    (memo, elementId) => {
      memo[elementId] = redDotComponents.includes(elementId);
      return memo;
    },
    {} as Record<ElementID, boolean>
  );

  return { isRedDotOn: isOn };
};
