import type { GenericEventData } from '@/levels/types/event-types';
import { useLevelActor } from '@/runtime/level-runtime';
import { DataEvent, VoidEvent } from '@/types/state-machine-event-enums';

type DataEventPayload = Extract<GenericEventData, { type: DataEvent }>;

export interface UseStateMachineEventResult {
  emitEvent: (event: VoidEvent) => void;
  emitDataEvent: (event: DataEventPayload) => void;
}

export const useStateMachineEvent = (): UseStateMachineEventResult => {
  const machineActor = useLevelActor();

  return {
    emitEvent: (event: VoidEvent) => machineActor.send({ type: event }),
    emitDataEvent: (event: DataEventPayload) => machineActor.send(event),
  };
};
