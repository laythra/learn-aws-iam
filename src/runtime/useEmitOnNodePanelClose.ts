import { useEffect, useRef } from 'react';

import { useStateMachineEvent } from './useStateMachineEvent';
import { VoidEvent } from '@/types/state-machine-event-enums';

// A little hook for emitting a state machine event when a node panel (e.g., content, tags, ARN) is closed.
export function useEmitOnNodePanelClose(isOpen: boolean, event: VoidEvent): void {
  const { emitEvent } = useStateMachineEvent();
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (wasOpenRef.current && !isOpen) emitEvent(event);
    wasOpenRef.current = isOpen;
  }, [isOpen]);
}
