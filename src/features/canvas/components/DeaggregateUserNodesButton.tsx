import { memo } from 'react';

import { type PlacementWithLogical, ChakraProps, IconButton } from '@chakra-ui/react';
import { ArrowsPointingOutIcon } from '@heroicons/react/20/solid';

import { useLevelActor } from '@/app_shell/runtime/level-runtime';
import { ElementID } from '@/config/element-ids';
import { StatefulStateMachineEvent } from '@/types/state-machine-event-enums';

interface DeaggregateUserNodesButtonProps extends ChakraProps {
  nodeId: string;
  placement?: PlacementWithLogical;
}

const DeaggregateUserNodesButton: React.FC<DeaggregateUserNodesButtonProps> = ({
  nodeId,
  ...styleProps
}) => {
  const levelActor = useLevelActor();

  const deaggregateUserNodes = (): void => {
    levelActor.send({
      type: StatefulStateMachineEvent.DeaggregateUserNodes,
      nodeId,
    });
  };

  return (
    <IconButton
      data-element-id={ElementID.IAMNodeArnButton}
      aria-label='arn'
      icon={<ArrowsPointingOutIcon />}
      variant='ghost'
      opacity={0.5}
      height='16px'
      width='16px'
      minWidth='auto'
      onClick={deaggregateUserNodes}
      _hover={{ bg: 'gray.200', opacity: 1 }}
      {...styleProps}
    />
  );
};

export default memo(DeaggregateUserNodesButton);
