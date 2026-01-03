import React, { forwardRef, ForwardRefExoticComponent, PropsWithoutRef } from 'react';

import _ from 'lodash';

import { TutorialPopover } from '@/components/Popover/TutorialPopover';
import { LevelsProgressionContext } from '@/components/providers/level-actor-contexts';
import { StatelessStateMachineEvent } from '@/types/state-machine-event-enums';

/**
 * `withPopover` is a decorator that wraps a component with a popover.
 * * Each passed component must have a unique string `'data-element-id'` prop.
 * @param {React.FC<T>} WrappedComponent The component to wrap with a popover.
 * @returns The wrapped component with a popover.
 */
export const withPopover = <T extends { 'data-element-id': string }, R = HTMLElement>(
  WrappedComponent: React.FC<T>
): ForwardRefExoticComponent<PropsWithoutRef<T> & React.RefAttributes<R>> => {
  const WithPopover = forwardRef<R, T>((props, ref) => {
    const machineActor = LevelsProgressionContext().useActorRef();
    const [showPopovers, popoverContent] = LevelsProgressionContext().useSelector(
      state => [state.context.show_popovers, state.context.popover_content],
      _.isEqual
    );

    const popoverOpen = showPopovers && popoverContent?.element_id === props['data-element-id'];

    const goToNextPopOver = (): void => {
      machineActor.send({ type: 'NEXT_POPOVER' });
    };

    const closePopover = (): void => {
      machineActor.send({ type: StatelessStateMachineEvent.HidePopovers });
    };

    return (
      <TutorialPopover
        isOpen={popoverOpen}
        label={popoverContent?.popover_title as string}
        description={popoverContent?.popover_content as string}
        showNextButton={popoverContent?.show_next_button as boolean}
        placement={popoverContent?.popover_placement}
        showCloseButton={popoverContent?.show_close_button}
        imagePath={popoverContent?.tutorial_gif}
        onNextClick={goToNextPopOver}
        onCloseClick={closePopover}
        elementId={props['data-element-id']}
      >
        <WrappedComponent {...props} ref={ref} />
      </TutorialPopover>
    );
  });

  WithPopover.displayName = `WithPopover(${WrappedComponent.displayName || WrappedComponent.name})`;

  return WithPopover;
};
