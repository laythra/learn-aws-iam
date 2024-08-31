import React, {
  forwardRef,
  ForwardRefExoticComponent,
  MouseEventHandler,
  PropsWithoutRef,
  MouseEvent,
} from 'react';

import type { EventFromLogic } from 'xstate';

import { LevelsProgressionContext } from '@/components/providers/LevelsProgressionProvider';

/**
 * `withStatemachineEvent` is a decorator that emits an event to the state machine when the wrapped component is clicked.
 * @param {React.FC<T>} WrappedComponent The component to wrap with an event emitter.
 * @returns The wrapped component with an event emitter.
 */
export const withStatemachineEvent = <
  T extends { event: string; onClick?: MouseEventHandler<HTMLButtonElement> },
  R = HTMLElement,
>(
  WrappedComponent: React.FC<T>
): ForwardRefExoticComponent<PropsWithoutRef<T> & React.RefAttributes<R>> => {
  const WithStatemachineEvent = forwardRef<R, T>((props, ref) => {
    const machineActor = LevelsProgressionContext.useActorRef();
    const stateMachine = LevelsProgressionContext.useSelector(state => state.machine);

    const emitEventToStateMachine = (): void => {
      machineActor.send({ type: props.event } as EventFromLogic<typeof stateMachine>);
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
