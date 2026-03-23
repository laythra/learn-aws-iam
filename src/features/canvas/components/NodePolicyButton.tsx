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
  Box,
  PopoverCloseButton,
} from '@chakra-ui/react';
import { CodeBracketIcon, PencilSquareIcon } from '@heroicons/react/20/solid';
import { useSelector } from '@xstate/store-react';

import { CanvasStore } from '../stores/canvas-store';
import AnimatedRedDot from '@/components/AnimatedRedDot';
import { ElementID } from '@/config/element-ids';
import { useAnimatedRedDot } from '@/runtime/ui/useAnimatedRedDot';
import { useStateMachineEvent } from '@/runtime/useStateMachineEvent';
import codeEditorStateStore from '@/stores/code-editor-state-store';
import { IAMCodeDefinedEntity } from '@/types/iam-enums';
import { VoidEvent } from '@/types/state-machine-event-enums';

interface NodePolicyButtonProps {
  nodeId: string;
  label: string;
  editable?: boolean;
  verboseDescription?: string;
  codeDescription?: string;
  placement?: PlacementWithLogical;
  selectedIAMEntity: IAMCodeDefinedEntity;
}

const NodePolicyButton: React.FC<NodePolicyButtonProps> = ({
  nodeId,
  label,
  verboseDescription,
  codeDescription,
  selectedIAMEntity,
  editable = false,
  placement = 'end-end',
}) => {
  const popoverContentRef = useRef<HTMLDivElement>(null);
  const openedNodeId = useSelector(CanvasStore, state => state.context.nodeIdWithOpenedContent);
  const { emitEvent } = useStateMachineEvent();
  const isContentOpen = openedNodeId === nodeId;

  const toggleNodeContentPopover = (): void => {
    CanvasStore.send({
      type: 'openNodePanel',
      nodeId,
      panel: isContentOpen ? undefined : 'content',
    });
  };

  const { isRedDotEnabledForElement } = useAnimatedRedDot();

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
    <Popover
      placement={placement}
      closeOnBlur={true}
      isLazy={true}
      closeDelay={0}
      isOpen={isContentOpen}
      variant='elevated'
    >
      <PopoverTrigger>
        <IconButton
          data-element-id={ElementID.IAMNodeContentButton}
          aria-label='info'
          icon={<CodeBracketIcon />}
          variant='ghost'
          opacity={0.5}
          height='16px'
          width='16px'
          minWidth='auto'
          onClick={() => {
            emitEvent(VoidEvent.IAMNodeContentOpened);
            toggleNodeContentPopover();
          }}
          _hover={{ bg: 'gray.200', opacity: 1 }}
        />
      </PopoverTrigger>
      <PopoverContent
        w='500px'
        overflow='auto'
        maxH='400px'
        ref={popoverContentRef}
        data-element-id={`${nodeId}-content`}
      >
        <PopoverArrow />
        <PopoverHeader textAlign='left' display='flex' alignItems='center'>
          <Text fontSize='16px' fontWeight='700'>
            {label}
          </Text>
        </PopoverHeader>
        <PopoverCloseButton
          onClick={() => {
            emitEvent(VoidEvent.IAMNodeContentClosed);
            CanvasStore.send({ type: 'closeAllNodePanels' });
          }}
          aria-label='close'
        />
        <PopoverBody textAlign='left'>
          <Code width='100%' whiteSpace='pre-wrap' position='relative'>
            {editable && (
              <Box position='absolute' top={2} right={2}>
                <Tooltip label='Edit' aria-label='Edit' placement='top'>
                  <IconButton
                    data-element-id={ElementID.IAMNodeContentEditButton}
                    onClick={() => {
                      codeEditorStateStore.send({
                        type: 'open',
                        mode: 'edit',
                        selectedNodeId: nodeId,
                        selectedIAMEntity,
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
                    opacity={0.5}
                    _hover={{ bg: 'gray.200', opacity: 1 }}
                  />
                </Tooltip>
                {isRedDotEnabledForElement(ElementID.IAMNodeContentEditButton) && (
                  <AnimatedRedDot />
                )}
              </Box>
            )}
            {codeDescription}
          </Code>
          {verboseDescription && <Text>{verboseDescription}</Text>}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default memo(NodePolicyButton);
