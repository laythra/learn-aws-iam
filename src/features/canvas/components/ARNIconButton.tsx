import { memo } from 'react';

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  type PlacementWithLogical,
  Tooltip,
  useToast,
  ChakraProps,
} from '@chakra-ui/react';
import { IdentificationIcon, ClipboardDocumentIcon } from '@heroicons/react/20/solid';
import { useSelector } from '@xstate/store/react';

import { CanvasStore } from '../stores/canvas-store';
import { WithStateMachineEventIconButton } from '@/components/Decorated';
import { StatelessStateMachineEvent } from '@/types/state-machine-event-enums';

interface ARNIconButtonProps extends ChakraProps {
  nodeId: string;
  arn: string;
  onOpenEvent: StatelessStateMachineEvent;
  onCopyEvent: StatelessStateMachineEvent;
  placement?: PlacementWithLogical;
}

const ARNIconButton: React.FC<ARNIconButtonProps> = ({
  nodeId,
  arn,
  onOpenEvent,
  onCopyEvent,
  placement = 'end-end',
  ...styleProps
}) => {
  const toast = useToast();

  const copyToClipboard = (): void => {
    navigator.clipboard.writeText(arn);
    toast({
      title: 'ARN copied to clipboard',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  const openedNodeId = useSelector(CanvasStore, state => state.context.nodeIdWithOpenedARN);
  const isARNOpen = openedNodeId === nodeId;

  const toggleNodeARNPopover = (): void => {
    CanvasStore.send({
      type: 'openNodePanel',
      nodeId,
      panel: isARNOpen ? undefined : 'arn',
    });
  };

  return (
    <Popover
      placement={placement}
      closeOnBlur={true}
      isLazy={true}
      closeDelay={0}
      isOpen={isARNOpen}
    >
      <PopoverTrigger>
        <WithStateMachineEventIconButton
          event={onOpenEvent}
          aria-label='arn'
          icon={<IdentificationIcon />}
          variant='ghost'
          opacity={0.5}
          height='16px'
          width='16px'
          minWidth='auto'
          onClick={toggleNodeARNPopover}
          _hover={{ bg: 'gray.200', opacity: 1 }}
          {...styleProps}
        />
      </PopoverTrigger>
      <PopoverContent width='auto'>
        <PopoverHeader
          textAlign='left'
          display='flex'
          flexWrap='wrap'
          alignItems='center'
          justifyContent='space-between'
          fontSize='12px'
          fontWeight='600'
        >
          {arn}
          <Tooltip label='Copy To Clipboard'>
            <WithStateMachineEventIconButton
              event={onCopyEvent}
              h='16px'
              w='16px'
              aria-label='copy arn'
              icon={<ClipboardDocumentIcon />}
              variant='ghost'
              opacity={0.5}
              size='sm'
              ml={2}
              minWidth='auto'
              onClick={copyToClipboard}
              _hover={{ bg: 'gray.200', opacity: 1 }}
            />
          </Tooltip>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  );
};

export default memo(ARNIconButton);
