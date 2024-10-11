import React, { forwardRef, ForwardRefExoticComponent, PropsWithoutRef } from 'react';

import _ from 'lodash';

import { TutorialPopover } from '@/components/Popover/TutorialPopover';
import { LevelsProgressionContext } from '@/components/providers/LevelsProgressionProvider';

/**
 * `withPopover` is a decorator that wraps a component with a popover.
 * * Each passed component must have a unique string `elementid` prop.
 * @param {React.FC<T>} WrappedComponent The component to wrap with a popover.
 * @returns The wrapped component with a popover.
 */
export const withPopover = <T extends { elementid: string }, R = HTMLElement>(
  WrappedComponent: React.FC<T>
): ForwardRefExoticComponent<PropsWithoutRef<T> & React.RefAttributes<R>> => {
  const WithPopover = forwardRef<R, T>((props, ref) => {
    const machineActor = LevelsProgressionContext.useActorRef();
    const [showPopovers, popoverContent] = LevelsProgressionContext.useSelector(
      state => [state.context.show_popovers, state.context.popover_content],
      _.isEqual
    );

    const popoverOpen = showPopovers && popoverContent?.element_id === props.elementid;

    const goToNextPopOver = (): void => {
      machineActor.send({ type: 'NEXT_POPOVER' });
    };

    const closePopover = (): void => {
      machineActor.send({ type: 'HIDE_POPOVERS' });
    };

    return (
      <TutorialPopover
        isOpen={popoverOpen}
        label={popoverContent?.popover_title as string}
        description={popoverContent?.popover_content as string}
        showNextButton={popoverContent?.show_next_button as boolean}
        placement={popoverContent?.popover_placement}
        showCloseButton={popoverContent?.show_close_button}
        onNextClick={goToNextPopOver}
        onCloseClick={closePopover}
      >
        <WrappedComponent {...props} ref={ref} />
      </TutorialPopover>
    );
  });

  WithPopover.displayName = `WithPopover(${WrappedComponent.displayName || WrappedComponent.name})`;

  return WithPopover;
};
