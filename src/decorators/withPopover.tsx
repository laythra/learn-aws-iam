import React from 'react';

import _ from 'lodash';

import { LevelsProgressionContext } from '@/components/levels_progression/LevelsProgressionProvider'; // eslint-disable-line
import { TutorialPopover } from '@/components/Popover/TutorialPopover';
import { InsideTutorialMetadata } from '@/machines/types';

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
    const context = LevelsProgressionContext.useSelector(state => state.context);
    const levelMetadata = LevelsProgressionContext.useSelector(state => state.getMeta());

    const activePopoverElementId = context.popovers_sequence_ids[context.active_popover_index];
    // This assumes that there is only one metadata object
    // TODO: handle multiple metadata objects
    const popoverMetadata = _.chain(levelMetadata)
      .values()
      .first()
      .value() as InsideTutorialMetadata;

    const goToNextPopOver = (): void => {
      machineActor.send({ type: 'NEXT_POPOVER' });
    };

    const isPopoverOpen = activePopoverElementId === props.id && context.inside_tutorial;

    return (
      <TutorialPopover
        onNextClick={goToNextPopOver}
        isOpen={isPopoverOpen}
        label={popoverMetadata?.popover_title as string}
        description={popoverMetadata?.popover_content as string}
      >
        <WrappedComponent {...props} />
      </TutorialPopover>
    );
  };

  return WithPopover;
};
