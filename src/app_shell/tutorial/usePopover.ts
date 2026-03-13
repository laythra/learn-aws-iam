import { useCallback, useMemo } from 'react';

import _ from 'lodash';

import type { PopoverTutorialMessage } from '@/levels/types/tutorial-message-types';
import { useLevelActor, useLevelSelector } from '@/runtime/level-runtime';
import { StatelessStateMachineEvent } from '@/types/state-machine-event-enums';

export interface UsePopoverResult {
  isOpen: boolean;
  content: PopoverTutorialMessage | undefined;
  goNext: () => void;
  close: () => void;
}

/**
 * Hook for popover functionality - replaces withPopover decorator
 * @param elementId The unique element ID for the popover target
 */
export const usePopover = (elementId: string): UsePopoverResult => {
  const machineActor = useLevelActor();
  const [showPopovers, popoverContent] = useLevelSelector(
    state => [state.context.show_popovers, state.context.popover_content],
    _.isEqual
  );

  const isOpen = showPopovers && popoverContent?.element_id === elementId;

  const goNext = useCallback(() => {
    machineActor.send({ type: 'NEXT_POPOVER' });
  }, [machineActor]);

  const close = useCallback(() => {
    machineActor.send({ type: StatelessStateMachineEvent.HidePopovers });
  }, [machineActor]);

  return useMemo(
    () => ({
      isOpen,
      content: isOpen ? popoverContent : undefined,
      goNext,
      close,
    }),
    [isOpen, popoverContent, goNext, close]
  );
};
