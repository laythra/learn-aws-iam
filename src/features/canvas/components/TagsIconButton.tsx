import { memo } from 'react';

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  type PlacementWithLogical,
  ChakraProps,
  PopoverBody,
  PopoverHeader,
  HStack,
  TagLabel,
  VStack,
  Tag,
  Text,
} from '@chakra-ui/react';
import { TagIcon } from '@heroicons/react/16/solid';
import { useSelector } from '@xstate/store/react';

import { CanvasStore } from '../stores/canvas-store';
import {
  WithStateMachineEventIconButton,
  WithStateMachineEventPopoverCloseButton,
} from '@/components/Decorated';
import { ElementID } from '@/config/element-ids';
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
          data-element-id={ElementID.IAMNodeTagsButton}
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
      <PopoverContent width='auto' data-element-id={`${nodeId}-tags`}>
        <PopoverHeader fontWeight='bold' fontSize='md'>
          <WithStateMachineEventPopoverCloseButton
            onClick={() => CanvasStore.send({ type: 'closeAllNodePanels' })}
            event={StatelessStateMachineEvent.IAMNodeTagsPopoverClosed}
            aria-label='close'
          />
          Tags
        </PopoverHeader>
        <PopoverBody py={2}>
          <VStack spacing={2}>
            {tags.map(([key, val]) => (
              <HStack key={key} spacing={1} alignItems='center'>
                <Tag>
                  <TagLabel fontWeight='700'>{key}</TagLabel>
                </Tag>
                <Text> : </Text>
                <Tag>
                  <TagLabel>{val}</TagLabel>
                </Tag>
              </HStack>
            ))}
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default memo(TagsIconButton);
