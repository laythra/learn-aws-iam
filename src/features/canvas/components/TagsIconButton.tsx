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
import { useSelector } from '@xstate/store/react';

import { CanvasStore } from '../stores/canvas-store';
import { WithStateMachineEventIconButton } from '@/components/Decorated';
import { StatelessStateMachineEvent } from '@/types/state-machine-event-enums';

interface TagsIconButtonProps extends ChakraProps {
  nodeId: string;
  onOpenEvent: StatelessStateMachineEvent;
  tags: Array<[string, string]>;
  placement?: PlacementWithLogical;
}

const TagsIconButton: React.FC<TagsIconButtonProps> = ({
  nodeId,
  onOpenEvent,
  tags,
  placement = 'end-end',
  ...styleProps
}) => {
  const openedNodeId = useSelector(CanvasStore, state => state.context.nodeIdWithOpenedTags);
  const areTagsOpen = openedNodeId === nodeId;

  const toggleNodeTagsPopover = (): void => {
    CanvasStore.send({
      type: 'openNodePanel',
      nodeId,
      panel: areTagsOpen ? undefined : 'tags',
    });
  };

  return (
    <Popover
      placement={placement}
      closeOnBlur={true}
      isLazy={true}
      isOpen={areTagsOpen}
      closeDelay={0}
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
          onClick={toggleNodeTagsPopover}
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
