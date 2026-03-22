import { ElementID } from '@/config/element-ids';
import { useLevelSelector } from '@/runtime/level-runtime';

interface AnimateRedDotContext {
  isRedDotEnabledForElement: (elementId: ElementID) => boolean;
}

export const useAnimatedRedDot = (): AnimateRedDotContext => {
  const highlighted = useLevelSelector(state =>
    Object.values(state.getMeta()).flatMap(
      m => (m as { highlighted_elements?: ElementID[] })?.highlighted_elements ?? []
    )
  );

  const dismissed = useLevelSelector(state => state.context.dismissed_highlighted_elements ?? []);

  const isRedDotEnabledForElement = (elementId: ElementID): boolean =>
    highlighted.includes(elementId) && !dismissed.includes(elementId);

  return { isRedDotEnabledForElement };
};
