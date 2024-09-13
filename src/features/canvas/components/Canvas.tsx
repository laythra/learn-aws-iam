import React, { useCallback, useEffect, useState } from 'react';

import { Box } from '@chakra-ui/react';
import { useSelector } from '@xstate/store/react';
import _ from 'lodash';
import ReactFlow, {
  ReactFlowInstance,
  useReactFlow,
  type Connection,
  type Edge,
  type Node,
} from 'reactflow';
import { EventFromLogic } from 'xstate';

import IAMCanvasNode from './IAMCanvasNode';
import {
  attachPolicyToGroup,
  attachUserToGroup,
  getUserToResourceEdgesForGroupAccess,
} from '../utils/edges-creation';
import { getNodeWithInitialPosition } from '../utils/nodes-position';
import DotsPattern from '@/assets/images/dots_pattern.svg';
import { LevelsProgressionContext } from '@/components/providers/LevelsProgressionProvider';
import { GenericInsideLevelMetadata } from '@/machines/types';
import { CanvasStore } from '@/stores/canvas-store';
import {
  type IAMEdgeData,
  type IAMGroupNodeData,
  type IAMUserNodeData,
  IAMAnyNodeData,
  IAMNodeEntity,
  IAMPolicyNodeData,
} from '@/types';
import { getEdgeName } from '@/utils/names';
import storage from '@/utils/storage';

import 'reactflow/dist/style.css';

const nodeTypes = {
  iam_default: IAMCanvasNode,
};

const Canvas: React.FC = () => {
  const { getViewport } = useReactFlow();
  const levelState = LevelsProgressionContext.useSelector(state => state);
  const levelActor = LevelsProgressionContext.useActorRef();

  const [rfInstance] = useState<ReactFlowInstance>();

  const setEdges = (edges: Edge<IAMEdgeData>[]): void => {
    levelActor.send({ type: 'SET_EDGES', edges: edges });
  };

  const updateNode = (node: Node<IAMAnyNodeData>): void => {
    levelActor.send({ type: 'UPDATE_IAM_NODE', node: node });
  };

  const [nodesState, edgesState] = useSelector(
    CanvasStore,
    state => [state.context.nodes, state.context.edges],
    _.isEqual
  );

  useEffect(() => {
    CanvasStore.send({ type: 'setEdges', edges: levelState.context.edges });
  }, [levelState.context.edges]);

  useEffect(() => {
    const nodeGroups = _.groupBy(levelState.context.nodes, 'data.entity');

    const newNodes = Object.keys(nodeGroups).flatMap(entityType => {
      const nodes = nodeGroups[entityType];
      return nodes.map((node, nodeIndex) =>
        getNodeWithInitialPosition(node, getViewport(), nodes.length, nodeIndex)
      );
    });

    CanvasStore.send({ type: 'setNodes', nodes: newNodes });
  }, [levelState.context.nodes]);

  useEffect(() => {
    if (rfInstance && levelState.context.level_finished) {
      const flowState = rfInstance.toObject();
      storage.setKey('flow_state', JSON.stringify(flowState));
    }
  }, [levelState.context.level_finished]);

  const onConnect = useCallback(
    (params: Connection) => {
      if (params.source === params.target) {
        return;
      }

      const edgeName = getEdgeName(params.source as string, params.target as string);
      const templateEdge = _.find(levelState.context.final_edges, { id: edgeName });
      const sourceNode = _.find(levelState.context.nodes, { id: params.source as string });
      const targetNode = _.find(levelState.context.nodes, { id: params.target as string });

      let newEdge;
      if (templateEdge) {
        newEdge = {
          ...templateEdge,
          data: {
            source_node_data: sourceNode?.data,
            target_node_data: targetNode?.data,
          },
        } as Edge<IAMEdgeData>;
      } else {
        // Create a generic edge
        newEdge = {
          ...params,
          id: edgeName,
          label: 'Attached to',
          labelStyle: { fill: 'black', fontWeight: 700 },
          data: {
            source_node_data: sourceNode?.data,
            target_node_data: targetNode?.data,
          },
        } as Edge<IAMEdgeData>;
      }

      let newEdges = [...levelState.context.edges, newEdge];

      if (targetNode?.data.entity !== IAMNodeEntity.Group) {
        setEdges(_.uniqBy(newEdges, 'id'));
        return;
      }

      let newGroupNode: Node<IAMGroupNodeData>;

      if (sourceNode?.data.entity === IAMNodeEntity.User) {
        newGroupNode = attachUserToGroup(
          sourceNode as Node<IAMUserNodeData>,
          targetNode as Node<IAMGroupNodeData>
        );
      } else {
        newGroupNode = attachPolicyToGroup(
          sourceNode as Node<IAMPolicyNodeData>,
          targetNode as Node<IAMGroupNodeData>
        );
      }

      const usersToResourceEdges = getUserToResourceEdgesForGroupAccess(
        newGroupNode as Node<IAMGroupNodeData>,
        levelState.context.nodes
      );

      newEdges = [...newEdges, ...usersToResourceEdges];
      newEdges = _.uniqBy(newEdges, 'id');

      setEdges(newEdges);
      updateNode(newGroupNode);

      _.forOwn(levelState.getMeta(), (value, statePath) => {
        const levelMetadata = value as GenericInsideLevelMetadata;

        const finishedTargets = levelMetadata.connection_targets?.map(connectionTarget => {
          if (_.differenceBy(connectionTarget.required_edges, newEdges, 'id').length === 0) {
            // We unlock all locked edges
            _.forEach(connectionTarget.locked_edges, edge => {
              newEdges = [...newEdges, edge];
            });

            return connectionTarget;
          }
        });

        if (_.compact(finishedTargets).length === levelMetadata.connection_targets?.length) {
          const actionName = levelState.context.metadata_keys[statePath];
          levelActor.send({ type: actionName } as EventFromLogic<typeof levelState.machine>);
        }
      });
    },

    [levelState]
  );

  const onEdgeDelete = useCallback((edges: Edge<IAMEdgeData>[]) => {
    levelActor.send({ type: 'DELETE_EDGE', edge: edges[0] });
  }, []);

  // const handleInit = useCallback((instance: ReactFlowInstance) => {
  //   if (!rfInstance) {
  //     setRfInstance(instance);
  //   }

  //   const rawFlowState = storage.getKey('flow_state');
  //   if (!rawFlowState) {
  //     return;
  //   }

  //   const flowState = JSON.parse(rawFlowState);

  //   // setNodesState(flowState.nodes);
  //   // setEdgesState(flowState.edges);
  // }, []);

  return (
    <Box
      backgroundColor='white'
      backgroundImage={DotsPattern}
      backgroundRepeat='repeat'
      position='relative'
      height='100vh'
    >
      <ReactFlow
        onNodesChange={changes => CanvasStore.send({ type: 'changeNodesState', changes })}
        onEdgesChange={changes => CanvasStore.send({ type: 'changeEdgesState', changes })}
        nodes={nodesState}
        edges={edgesState}
        onConnect={onConnect}
        onEdgesDelete={onEdgeDelete}
        nodeTypes={nodeTypes}
        // onInit={handleInit}
      />
    </Box>
  );
};

export default Canvas;
