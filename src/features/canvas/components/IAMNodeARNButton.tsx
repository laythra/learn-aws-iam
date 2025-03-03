import { memo } from 'react';

import {
  Popover,
  Text,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  type PlacementWithLogical,
  Tooltip,
  useToast,
} from '@chakra-ui/react';
import { IdentificationIcon, ClipboardDocumentIcon } from '@heroicons/react/20/solid';

import { CanvasStore } from '../stores/canvas-store';
import { WithStateMachineEventIconButton } from '@/components/Decorated';
import { StatelessStateMachineEvent } from '@/types/state-machine-event-enums';

interface IAMNodeARNButtonProps {
  arn: string;
  placement?: PlacementWithLogical;
}

const IAMNodeARNButton: React.FC<IAMNodeARNButtonProps> = ({ arn, placement = 'end-end' }) => {
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

  const closeOpenedNode = (): void => {
    CanvasStore.send({ type: 'updateOpenedNodeId', nodeId: '-' });
  };

  return (
    <Popover
      placement={placement}
      closeOnBlur={true}
      isLazy={true}
      closeDelay={0}
      onOpen={closeOpenedNode}
    >
      <PopoverTrigger>
        <WithStateMachineEventIconButton
          event={StatelessStateMachineEvent.IAMNodeARNOpened}
          aria-label='arn'
          icon={<IdentificationIcon />}
          variant='ghost'
          opacity={0.5}
          height='16px'
          width='16px'
          minWidth='auto'
          _hover={{ bg: 'gray.200', opacity: 1 }}
        />
      </PopoverTrigger>
      <PopoverContent width='auto'>
        <PopoverHeader
          textAlign='left'
          display='flex'
          flexWrap='wrap'
          alignItems='center'
          justifyContent='space-between'
        >
          <Text fontSize='12px' fontWeight='600'>
            {arn}
          </Text>
          <Tooltip label='Copy To Clipboard'>
            <WithStateMachineEventIconButton
              event={StatelessStateMachineEvent.IAMNodeARNCopied}
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

export default memo(IAMNodeARNButton);
