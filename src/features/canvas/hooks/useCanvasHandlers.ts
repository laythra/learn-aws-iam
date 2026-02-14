import { useCallback } from 'react';

import { useToast } from '@chakra-ui/react';
import { Connection } from '@xyflow/react';
import _ from 'lodash';

import { LevelActorRef } from './useCanvasSync';
import { getValidConnectionDirection } from '../utils/edges-creation';
import { IAMAnyNode, IAMEdge } from '@/types/iam-node-types';
import { StatefulStateMachineEvent } from '@/types/state-machine-event-enums';

interface UseCanvasHandlersOptions {
  nodes: IAMAnyNode[];
  blockedConnections?: { from: string; to: string }[];
  edgesManagementDisabled?: boolean;
  levelActor: LevelActorRef;
}

interface UseCanvasHandlersReturn {
  onConnect: (params: Connection) => void;
  onEdgeDelete: (targetEdges: IAMEdge[]) => void;
  onNodeDelete: (targetNodes: IAMAnyNode[]) => void;
}

export function useCanvasHandlers({
  nodes,
  blockedConnections,
  edgesManagementDisabled,
  levelActor,
}: UseCanvasHandlersOptions): UseCanvasHandlersReturn {
  const toast = useToast();

  const showInvalidConnectionToast = useCallback(() => {
    toast({
      title: 'Invalid Connection',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  }, [toast]);

  const showInsufficientPermissionsToast = useCallback(() => {
    toast({
      title: 'Insufficient Permissions to Create Connection',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  }, [toast]);

  const onConnect = useCallback(
    (params: Connection) => {
      if (
        params.source === params.target ||
        !params.source ||
        !params.target ||
        edgesManagementDisabled
      ) {
        showInvalidConnectionToast();
        return;
      }

      // TODO: Consider sending only node IDs instead of full node objects, and let the state machine look them up.
      // This would simplify internal state machine events where full node data may not be readily available.
      const sourceNode = _.find<IAMAnyNode>(nodes, { id: params.source });
      const targetNode = _.find<IAMAnyNode>(nodes, { id: params.target });

      if (!sourceNode || !targetNode) {
        alert('Error finding source or target node for new connection. Please try again.');
        return;
      }

      const connectionDirection = getValidConnectionDirection(sourceNode, targetNode);

      if (!connectionDirection) {
        showInvalidConnectionToast();
        return;
      }

      const isBlockedConnection = blockedConnections?.some(blockedConn => {
        return (
          blockedConn.from === connectionDirection.source.id &&
          blockedConn.to === connectionDirection.target.id
        );
      });

      if (isBlockedConnection) {
        showInsufficientPermissionsToast();
        return;
      }

      levelActor.send({
        type: StatefulStateMachineEvent.ConnectNodes,
        sourceNode: connectionDirection.source,
        targetNode: connectionDirection.target,
      });
    },
    [
      blockedConnections,
      edgesManagementDisabled,
      levelActor,
      nodes,
      showInsufficientPermissionsToast,
      showInvalidConnectionToast,
    ]
  );

  const onEdgeDelete = useCallback(
    (targetEdges: IAMEdge[]) => {
      levelActor.send({ type: StatefulStateMachineEvent.DeleteEdge, edge: targetEdges[0] });
    },
    [levelActor]
  );

  const onNodeDelete = useCallback(
    (targetNodes: IAMAnyNode[]) => {
      levelActor.send({ type: StatefulStateMachineEvent.DeleteNode, node: targetNodes[0] });
    },
    [levelActor]
  );

  return {
    onConnect,
    onEdgeDelete,
    onNodeDelete,
  };
}
