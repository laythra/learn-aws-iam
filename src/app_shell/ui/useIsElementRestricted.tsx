import { useMemo } from 'react';

import _ from 'lodash';

import { useLevelSelector } from '@/runtime/level-runtime';

/*
 * Determines the restriction status of a list of element IDs based on the current tutorial state.
 * An element is considered restricted if:
 * - It appears in the `restrictedElementIds` list, or
 * - The tutorial is active and it is not included in `whitelistedElementIds`.
 */
export function useIsElementRestricted(elementIds: string[]): boolean[] {
  const [inTutorialState, whitelistedIds, restrictedIds] = useLevelSelector(
    state => [
      state.context.in_tutorial_state,
      state.context.whitelisted_element_ids,
      state.context.restricted_element_ids,
    ],
    _.isEqual
  );

  return useMemo(() => {
    return elementIds.map(id => {
      const isRestricted = restrictedIds?.includes(id) ?? false;
      const isNotWhitelisted = !whitelistedIds?.includes(id);

      return isRestricted || ((inTutorialState ?? false) && isNotWhitelisted);
    });
  }, [elementIds, inTutorialState, whitelistedIds, restrictedIds]);
}
