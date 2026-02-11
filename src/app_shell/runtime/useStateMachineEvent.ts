import { useCallback, useMemo } from 'react';

import { useLevelActor } from '@/app_shell/runtime/level-runtime';
import { StatelessStateMachineEvent } from '@/types/state-machine-event-enums';

export interface UseStateMachineEventResult {
  emitEvent: (event: StatelessStateMachineEvent) => void;
}

export const useStateMachineEvent = (): UseStateMachineEventResult => {
  const machineActor = useLevelActor();

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
