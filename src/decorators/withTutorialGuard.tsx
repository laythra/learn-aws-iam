import React, { forwardRef, ForwardRefExoticComponent, PropsWithoutRef } from 'react';

import { Tooltip } from '@chakra-ui/react';
import _ from 'lodash';

import { LevelsProgressionContext } from '@/components/providers/LevelsProgressionProvider';

/**
 * `withTutorialGuard` is a decorator for wrapping elements with a tutorial guard.
 * a "tutorial guard" is merely a wrapper that blocks the user from interacting with the element
 * @param {React.FC<T>} WrappedComponent The component to wrap with the guard.
 * @returns The wrapped component with a guard.
 * TODO: Convert this into a hook
 */
export const withTutorialGuard = <
  T extends { isDisabled?: boolean; elementid: string },
  TRef = HTMLElement,
>(
  WrappedComponent: React.FC<T>
): ForwardRefExoticComponent<PropsWithoutRef<T> & React.RefAttributes<TRef>> => {
  const TutorialGuardedComponent = forwardRef<TRef, T>(({ elementid, ...props }, ref) => {
    const [inTutorialState, whitelistedElementIds, blackListedElementIds] =
      LevelsProgressionContext().useSelector(
        state => [
          state.context.in_tutorial_state,
          state.context.whitelisted_element_ids,
          state.context.restricted_element_ids,
        ],
        _.isEqual
      );

    const isWhitelisted = whitelistedElementIds?.includes(elementid) ?? false;
    const isRestricted = blackListedElementIds?.includes(elementid) ?? false;

    const shouldHide = isRestricted || (inTutorialState && !isWhitelisted);

    if (shouldHide) {
      return null;
    }

    return <WrappedComponent {...(props as T)} id={elementid} ref={ref} />;
  });

  TutorialGuardedComponent.displayName = `TutorialGuardedComponent(${
    WrappedComponent.displayName || WrappedComponent.name
  })`;

  return TutorialGuardedComponent;
};
