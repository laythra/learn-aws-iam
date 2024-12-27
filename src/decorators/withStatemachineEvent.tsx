import React, {
  forwardRef,
  ForwardRefExoticComponent,
  MouseEventHandler,
  PropsWithoutRef,
  MouseEvent,
} from 'react';

import { LevelsProgressionContext } from '@/components/providers/LevelsProgressionProvider';
import { StatelessStateMachineEvent } from '@/types/state-machine-event-enums';

/**
 * `withStatemachineEvent` is a decorator that emits an event to the state machine when the wrapped component is clicked.
 * @param {React.FC<T>} WrappedComponent The component to wrap with an event emitter.
 * @returns The wrapped component with an event emitter.
 */
export const withStatemachineEvent = <
  TEvent extends {
    event: StatelessStateMachineEvent;
    onClick?: MouseEventHandler<HTMLButtonElement>;
  },
  TRef = HTMLElement,
>(
  WrappedComponent: React.FC<TEvent>
): ForwardRefExoticComponent<PropsWithoutRef<TEvent> & React.RefAttributes<TRef>> => {
  const WithStatemachineEvent = forwardRef<TRef, TEvent>((props, ref) => {
    const machineActor = LevelsProgressionContext.useActorRef();

    const emitEventToStateMachine = (): void => {
      machineActor.send({ type: props.event });
    };

    const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
      if (props.onClick) {
        props.onClick(event);
      }

      emitEventToStateMachine();
    };

    return <WrappedComponent {...props} ref={ref} onClick={handleClick} />;
  });

  WithStatemachineEvent.displayName = `WithStateMachineEvent(${
    WrappedComponent.displayName || WrappedComponent.name
  })`;

  return WithStatemachineEvent;
};
