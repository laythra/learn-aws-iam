import { memo } from 'react';

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  type PlacementWithLogical,
  ChakraProps,
  PopoverBody,
} from '@chakra-ui/react';
import { ListBulletIcon, UserIcon } from '@heroicons/react/20/solid';
import { useSelector } from '@xstate/store/react';

import { CanvasStore } from '../stores/canvas-store';
import { WithStateMachineEventIconButton } from '@/components/Decorated';
import { ElementID } from '@/config/element-ids';
import { StatelessStateMachineEvent } from '@/types/state-machine-event-enums';

interface AggregatedUsersListButtonProps extends ChakraProps {
  nodeId: string;
  onOpenEvent: StatelessStateMachineEvent;
  users: string[];
  placement?: PlacementWithLogical;
}

const AggregatedUsersListButton: React.FC<AggregatedUsersListButtonProps> = ({
  nodeId,
  onOpenEvent,
  users,
  placement = 'end-end',
  ...styleProps
}) => {
  const openedNodeId = useSelector(CanvasStore, state => state.context.nodeIdWithOpenedUsersList);
  const isUsersListOpened = openedNodeId === nodeId;

  const toggleNodeARMUsersButton = (): void => {
    CanvasStore.send({
      type: 'openNodePanel',
      nodeId,
      panel: isUsersListOpened ? undefined : 'users-list',
    });
  };

  return (
    <Popover
      placement={placement}
      closeOnBlur={true}
      isLazy={true}
      closeDelay={0}
      isOpen={isUsersListOpened}
    >
      <PopoverTrigger>
        <WithStateMachineEventIconButton
          event={onOpenEvent}
          data-element-id={ElementID.IAMNodeArnButton}
          aria-label='arn'
          icon={<ListBulletIcon />}
          variant='ghost'
          opacity={0.5}
          height='16px'
          width='16px'
          minWidth='auto'
          onClick={toggleNodeARMUsersButton}
          _hover={{ bg: 'gray.200', opacity: 1 }}
          {...styleProps}
        />
      </PopoverTrigger>
      <PopoverContent
        width='auto'
        maxWidth='300px'
        data-element-id={`${nodeId}-arn`}
        boxShadow='lg'
        borderRadius='md'
      >
        <PopoverHeader
          textAlign='left'
          display='flex'
          flexWrap='wrap'
          alignItems='center'
          justifyContent='space-between'
          fontSize='sm'
          fontWeight='semibold'
          borderBottomWidth='1px'
          borderColor='gray.200'
        >
          Aggregated Users
        </PopoverHeader>
        <PopoverBody px={2} py={0}>
          <ul style={{ listStyleType: 'none', margin: 0, padding: 0 }}>
            {users.map((user, index) => (
              <li
                key={user}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 0',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#2D3748',
                  borderBottom: index === users.length - 1 ? 'none' : '1px solid #E2E8F0',
                }}
              >
                <UserIcon width={16} height={16} style={{ color: '#718096', flexShrink: 0 }} />
                <span>{user}</span>
              </li>
            ))}
          </ul>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default memo(AggregatedUsersListButton);
