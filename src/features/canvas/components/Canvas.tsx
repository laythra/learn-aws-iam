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

import IAMCanvasNode from './IAMCanvasNode';
import { edgeConnectionHandlers } from '../utils/edges-creation';
import { getNodeWithInitialPosition } from '../utils/nodes-position';
import DotsPattern from '@/assets/images/dots_pattern.svg';
import { LevelsProgressionContext } from '@/components/providers/LevelsProgressionProvider';
import useSidePanels from '@/hooks/useSidePanels';
import { CanvasStore } from '@/stores/canvas-store';
import { type IAMEdgeData, IAMAnyNodeData } from '@/types';
import storage from '@/utils/storage';

import 'reactflow/dist/style.css';

const nodeTypes = {
  iam_default: IAMCanvasNode,
};

const Canvas: React.FC = () => {
  const { getViewport } = useReactFlow();
  const levelState = LevelsProgressionContext.useSelector(state => state);
  const levelActor = LevelsProgressionContext.useActorRef();
  const { ref: sidePanelRef } = useSidePanels();

  const [rfInstance] = useState<ReactFlowInstance>();

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
    const nodeGroups = _.groupBy(levelState.context.nodes, 'data.initial_position');

    const newNodes = Object.keys(nodeGroups).flatMap(entityType => {
      const nodes = nodeGroups[entityType];

      return nodes.map((node, nodeIndex) => {
        const existingNode = _.find(nodesState, { id: node.id });

        if (existingNode) {
          return {
            ...existingNode,
            data: { ...existingNode.data, ...node.data },
            position: existingNode.position, // Ensure position remains unchanged
          };
        }

        return getNodeWithInitialPosition(
          node,
          getViewport(),
          nodes.length,
          nodeIndex,
          sidePanelRef?.current?.clientWidth || 0
        );
      });
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

      const sourceNode = _.find(levelState.context.nodes, { id: params.source as string });
      const targetNode = _.find(levelState.context.nodes, { id: params.target as string });
      const connectionHandlerKey = `${sourceNode?.data.entity}-${targetNode?.data.entity}`;
      const connectionHandler = edgeConnectionHandlers[connectionHandlerKey];

      if (!connectionHandler || !sourceNode || !targetNode) {
        return;
      }

      const updatedNode = connectionHandler(sourceNode, targetNode);
      updateNode(updatedNode);
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
