import { LevelsProgressionContext } from '@/components/providers/LevelsProgressionProvider';
import { ElementID } from '@/config/element-ids';

interface AnimateRedDotContext {
  isOn: boolean;
  turnOff: () => void;
}

interface UseAnimatedRedDotOptions {
  elementId: ElementID;
}

export const useAnimatedRedDot = ({
  elementId,
}: UseAnimatedRedDotOptions): AnimateRedDotContext => {
  const redDotComponents = LevelsProgressionContext().useSelector(
    state => state.context.elements_with_animated_red_dot ?? []
  );

  const turnOff = (): void => {
    LevelsProgressionContext()
      .useActorRef()
      .send({ type: 'UPDATE_RED_DOT_VISIBILITY', element_ids: [elementId], is_visible: false });
  };

  return { isOn: redDotComponents.includes(elementId), turnOff };
};
