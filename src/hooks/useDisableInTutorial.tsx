import _ from 'lodash';

import { LevelsProgressionContext } from '@/components/providers/LevelsProgressionProvider';
import { ElementID } from '@/config/element-ids';

interface UseDisableInTutorialContext {
  isElementEnabled: (elementId: ElementID) => boolean;
}

interface UseDisableInTutorialOptions {
  elementIds: ElementID[];
}

export const useDisableInTutorial = ({
  elementIds,
}: UseDisableInTutorialOptions): UseDisableInTutorialContext => {
  const [inTutorialState, shownElementIds] = LevelsProgressionContext().useSelector(
    state => [state.context.in_tutorial_state, state.context.whitelisted_element_ids],
    _.isEqual
  );

  const enabledElements = elementIds.reduce(
    (memo, elementId) => {
      memo[elementId] = shownElementIds?.includes(elementId) ?? false;
      return memo;
    },
    {} as Record<ElementID, boolean>
  );

  const isElementEnabled = (elementId: ElementID): boolean => {
    if (!inTutorialState) return true;

    return enabledElements[elementId];
  };

  return { isElementEnabled };
};
