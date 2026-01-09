import { useCallback, useMemo } from 'react';

import { LevelsProgressionContext } from '@/components/providers/level-actor-contexts';
import { StatelessStateMachineEvent } from '@/types/state-machine-event-enums';

export interface UseStateMachineEventResult {
  emitEvent: (event: StatelessStateMachineEvent) => void;
}

export const useStateMachineEvent = (): UseStateMachineEventResult => {
  const machineActor = LevelsProgressionContext().useActorRef();

  const emitEvent = useCallback(
    (event: StatelessStateMachineEvent) => {
      machineActor.send({ type: event });
    },
    [machineActor]
  );

  return useMemo(
    () => ({
      emitEvent,
    }),
    [emitEvent]
  );
};
