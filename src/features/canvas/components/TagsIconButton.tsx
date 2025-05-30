import { memo } from 'react';

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  type PlacementWithLogical,
  ChakraProps,
  UnorderedList,
  ListItem,
  PopoverBody,
  PopoverHeader,
} from '@chakra-ui/react';
import { TagIcon } from '@heroicons/react/16/solid';

import { CanvasStore } from '../stores/canvas-store';
import { WithStateMachineEventIconButton } from '@/components/Decorated';
import { StatelessStateMachineEvent } from '@/types/state-machine-event-enums';

interface TagsIconButtonProps extends ChakraProps {
  onOpenEvent: StatelessStateMachineEvent;
  tags: Array<[string, string]>;
  placement?: PlacementWithLogical;
}

const TagsIconButton: React.FC<TagsIconButtonProps> = ({
  onOpenEvent,
  tags,
  placement = 'end-end',
  ...styleProps
}) => {
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
          event={onOpenEvent}
          aria-label='arn'
          icon={<TagIcon />}
          variant='ghost'
          opacity={0.5}
          height='16px'
          width='16px'
          minWidth='auto'
          _hover={{ bg: 'gray.200', opacity: 1 }}
          {...styleProps}
        />
      </PopoverTrigger>
      <PopoverContent width='auto'>
        <PopoverHeader fontWeight='bold' fontSize='md'>
          Tags
        </PopoverHeader>
        <PopoverBody py={2}>
          <UnorderedList spacing={1}>
            {tags.map(([key, val]) => (
              <ListItem key={key}>
                <span style={{ fontWeight: 'bold' }}>{key}:</span>
                <span style={{ marginLeft: '4px' }}>{val}</span>
              </ListItem>
            ))}
          </UnorderedList>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default memo(TagsIconButton);
