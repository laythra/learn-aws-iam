import React from 'react';

import { LevelsProgressionContext } from '@/components/levels_progression/LevelsProgressionProvider'; // eslint-disable-line
import { TutorialPopover } from '@/components/Popover/TutorialPopover';

/**
 * `withPopover` is a decorator that wraps a component with a popover.
 * * Each passed component must have a unique string `id` prop.
 * @param {React.FC<T>} WrappedComponent The component to wrap with a popover.
 * @returns The wrapped component with a popover.
 */
export const withPopover = <T extends { id: string }>(
  WrappedComponent: React.FC<T>
): React.FC<T> => {
  const WithPopover: React.FC<T> = props => {
    const machineActor = LevelsProgressionContext.useActorRef();
    const activePopoverElementId = LevelsProgressionContext.useSelector(
      state => state.context.active_popover_element_id
    );

    // TODO: Fetch current state metadata in a more efficient way
    const activeStateMetadata = LevelsProgressionContext.useSelector(
      state => state.getMeta()[state.context.popover_meta_key]
    );

    const goToNextPopOver = (): void => {
      machineActor.send({ type: 'NEXT_POPOVER' });
    };

    const isPopoverOpen = activePopoverElementId === props.id;

    return (
      <TutorialPopover
        onNextClick={goToNextPopOver}
        isOpen={isPopoverOpen}
        label={activeStateMetadata?.popover_title as string}
        description={activeStateMetadata?.popover_content as string}
      >
        <WrappedComponent {...props} />
      </TutorialPopover>
    );
  };

  return WithPopover;
};
