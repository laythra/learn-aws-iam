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
  const TutorialGuardedComponent = forwardRef<TRef, T>(
    ({ isDisabled, elementid, ...props }, ref) => {
      const [inTutorialState, whitelistedElementIds] = LevelsProgressionContext().useSelector(
        state => [state.context.in_tutorial_state, state.context.whitelisted_element_ids],
        _.isEqual
      );

      const forceDisable = inTutorialState && !whitelistedElementIds?.includes(elementid);

      if (forceDisable) {
        return null;
      }

      return (
        <>
          <Tooltip
            label={forceDisable ? 'This utility is blocked during the tutorial.' : undefined}
            isDisabled={!forceDisable}
          >
            <WrappedComponent
              {...(props as T)}
              id={elementid}
              isDisabled={isDisabled || forceDisable}
              ref={ref}
            />
          </Tooltip>
        </>
      );
    }
  );

  TutorialGuardedComponent.displayName = `TutorialGuardedComponent(${
    WrappedComponent.displayName || WrappedComponent.name
  })`;

  return TutorialGuardedComponent;
};
