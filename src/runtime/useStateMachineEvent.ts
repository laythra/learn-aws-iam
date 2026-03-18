import { useCallback, useMemo } from 'react';

import { useLevelActor } from '@/runtime/level-runtime';
import { VoidEvent } from '@/types/state-machine-event-enums';

export interface UseStateMachineEventResult {
  emitEvent: (event: VoidEvent) => void;
}

export const useStateMachineEvent = (): UseStateMachineEventResult => {
  const machineActor = useLevelActor();

  const emitEvent = useCallback(
    (event: VoidEvent) => {
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
