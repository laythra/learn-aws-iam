import { useEffect, useRef } from 'react';
import { memo } from 'react';

import {
  Popover,
  Text,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverHeader,
  PopoverBody,
  IconButton,
  type PlacementWithLogical,
  Code,
  Tooltip,
} from '@chakra-ui/react';
import { CodeBracketIcon, PencilSquareIcon } from '@heroicons/react/20/solid';

import { CanvasStore } from '../stores/canvas-store';
import {
  GuardedIconButtonWithStateMachineEvent,
  WithStateMachineEventPopoverCloseButton,
} from '@/components/Decorated';
import { ElementID } from '@/config/element-ids';
import codeEditorStateStore from '@/features/code_editor/stores/code-editor-state-store';
import codeEditorPopupStore, { CodeEditorMode } from '@/stores/code-editor-popup-store';
import { StatelessStateMachineEvent } from '@/types/state-machine-event-enums';

interface IAMNodeInfoButtonProps {
  nodeId: string;
  label: string;
  opened: boolean;
  editable?: boolean;
  verboseDescription?: string;
  codeDescription?: string;
  placement?: PlacementWithLogical;
}

const IAMNodeInfoButton: React.FC<IAMNodeInfoButtonProps> = ({
  nodeId,
  label,
  opened,
  verboseDescription,
  codeDescription,
  editable = false,
  placement = 'end-end',
}) => {
  const popoverContentRef = useRef<HTMLDivElement>(null);
  const toggleNodeContentPopover = (): void => {
    const isContentOpened = CanvasStore.getSnapshot().context.openedNodeId === nodeId;

    if (isContentOpened) {
      CanvasStore.send({ type: 'updateOpenedNodeId', nodeId: '-' });
    } else {
      CanvasStore.send({ type: 'updateOpenedNodeId', nodeId });
    }
  };

  // Prevent scrolling on the popover content from zooming in/out the canvas
  useEffect(() => {
    const handleWheel = (event: WheelEvent): void => {
      event.stopPropagation();
    };

    const popoverContent = popoverContentRef.current;
    if (popoverContent) {
      popoverContent.addEventListener('wheel', handleWheel);
    }

    return () => {
      if (popoverContent) {
        popoverContent.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  return (
    <Popover placement={placement} closeOnBlur={true} isLazy={true} closeDelay={0} isOpen={opened}>
      <PopoverTrigger>
        <GuardedIconButtonWithStateMachineEvent
          elementid={ElementID.IAMNodeContentButton}
          event={StatelessStateMachineEvent.IAMNodeContentOpened}
          aria-label='info'
          icon={<CodeBracketIcon />}
          variant='ghost'
          opacity={0.5}
          height='16px'
          width='16px'
          minWidth='auto'
          onClick={toggleNodeContentPopover}
          _hover={{ bg: 'gray.200', opacity: 1 }}
        />
      </PopoverTrigger>
      <PopoverContent w='500px' overflow='auto' h='300px' ref={popoverContentRef}>
        <PopoverArrow />
        <PopoverHeader textAlign='left' display='flex' alignItems='center'>
          <Text fontSize='16px' fontWeight='700'>
            {label}
          </Text>
        </PopoverHeader>
        <WithStateMachineEventPopoverCloseButton
          onClick={() => CanvasStore.send({ type: 'updateOpenedNodeId', nodeId: '-' })}
          event={StatelessStateMachineEvent.IAMNodeContentClosed}
        />
        <PopoverBody textAlign='left'>
          <Code width='100%' whiteSpace='pre-wrap' position='relative'>
            {editable && (
              <Tooltip label='Edit' aria-label='Edit' placement='top'>
                <IconButton
                  onClick={() => {
                    codeEditorPopupStore.send({
                      type: 'open',
                      mode: CodeEditorMode.Edit,
                      selectedNodeId: nodeId,
                    });

                    toggleNodeContentPopover();
                  }}
                  ml={1}
                  aria-label='edit'
                  icon={<PencilSquareIcon />}
                  variant='ghost'
                  minWidth='auto'
                  height='20px'
                  width='20px'
                  position='absolute'
                  top={2}
                  right={2}
                  opacity={0.5}
                  _hover={{ bg: 'gray.200', opacity: 1 }}
                />
              </Tooltip>
            )}
            {codeDescription}
          </Code>
          {verboseDescription && <Text>{verboseDescription}</Text>}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default memo(IAMNodeInfoButton);
