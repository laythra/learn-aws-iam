import { useMemo } from 'react';

import _ from 'lodash';

import { useLevelSelector } from '@/components/providers/level-actor-contexts';

export interface UseTutorialGuardResult {
  shouldHide: boolean;
}

/**
 * Hook for tutorial guard functionality - replaces withTutorialGuard decorator
 * @param elementId The unique element ID for the guarded element
 */
export const useTutorialGuard = (elementId: string): UseTutorialGuardResult => {
  const [inTutorialState, whitelistedElementIds, blackListedElementIds] = useLevelSelector(
    state => [
      state.context.in_tutorial_state,
      state.context.whitelisted_element_ids,
      state.context.restricted_element_ids,
    ],
    _.isEqual
  );

  const isWhitelisted = whitelistedElementIds?.includes(elementId) ?? false;
  const isRestricted = blackListedElementIds?.includes(elementId) ?? false;
  const shouldHide = isRestricted || (inTutorialState && !isWhitelisted);

  return useMemo(
    () => ({
      shouldHide: shouldHide ?? false,
    }),
    [shouldHide]
  );
};
