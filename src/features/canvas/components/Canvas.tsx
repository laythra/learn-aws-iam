import React, { useCallback, useEffect, useState } from 'react';

import { Box } from '@chakra-ui/react';
import { useSelector } from '@xstate/store/react';
import _ from 'lodash';
import ReactFlow, {
  Node,
  ReactFlowInstance,
  useReactFlow,
  type Connection,
  type Edge,
} from 'reactflow';
import { EventFromLogic } from 'xstate';

import IAMCanvasEdge from './IAMCanvasEdge';
import IAMCanvasNode from './IAMCanvasNode';
import { CanvasStore } from '../stores/canvas-store';
import { edgeConnectionHandlers } from '../utils/edges-creation';
import { getNodeWithInitialPosition } from '../utils/nodes-position';
import DotsPattern from '@/assets/images/dots_pattern.svg';
import {
  currentLevelStateMachine,
  LevelsProgressionContext,
} from '@/components/providers/LevelsProgressionProvider';
import useSidePanels from '@/hooks/useSidePanels';
import { IAMAnyNodeData, IAMNodeEntity, type IAMEdgeData } from '@/types';
import storage from '@/utils/storage';

import 'reactflow/dist/style.css';

const nodeTypes = {
  iam_default: IAMCanvasNode,
};

const edgeTypes = {
  iam_default: IAMCanvasEdge,
};

const Canvas: React.FC = () => {
  const reactFlow = useReactFlow();
  const [nodes, edges, levelFinished] = LevelsProgressionContext.useSelector(
    state => [state.context.nodes, state.context.edges, state.context.level_finished],
    _.isEqual
  );

  const levelActor = LevelsProgressionContext.useActorRef();
  const { ref: sidePanelRef } = useSidePanels();

  const [rfInstance] = useState<ReactFlowInstance>();

  const [nodesState, edgesState] = useSelector(
    CanvasStore,
    state => [state.context.nodes, state.context.edges],
    _.isEqual
  );

  useEffect(() => {
    CanvasStore.send({ type: 'setEdges', edges });
  }, [edges]);

  useEffect(() => {
    const nodeGroups = _.groupBy(nodes, 'data.initial_position');

    const newNodes = Object.values(nodeGroups).flatMap(nodesGroup => {
      return nodesGroup.map((node, nodeIndex) => {
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
          reactFlow.getViewport(),
          nodesGroup.length,
          nodeIndex,
          sidePanelRef?.current?.clientWidth || 0
        );
      });
    });

    CanvasStore.send({ type: 'setNodes', nodes: newNodes });
  }, [nodes]);

  useEffect(() => {
    if (rfInstance && levelFinished) {
      const flowState = rfInstance.toObject();
      storage.setKey('flow_state', JSON.stringify(flowState));
    }
  }, [levelFinished]);

  const onConnect = useCallback(
    (params: Connection) => {
      if (params.source === params.target || !params.source || !params.target) {
        return;
      }

      const sourceNode = _.find<Node<IAMAnyNodeData>>(nodes, { id: params.source });
      const targetNode = _.find<Node<IAMAnyNodeData>>(nodes, { id: params.target });

      const connectionHandlerKey = `${sourceNode?.data.entity}-${targetNode?.data.entity}`;
      const connectionEventName = edgeConnectionHandlers[connectionHandlerKey];

      if (!connectionEventName) {
        return;
      }

      levelActor.send({ type: connectionEventName, sourceNode, targetNode } as EventFromLogic<
        typeof currentLevelStateMachine
      >);
    },
    [nodes]
  );

  const onEdgeDelete = useCallback((targetEdges: Edge<IAMEdgeData>[]) => {
    levelActor.send({ type: 'DELETE_EDGE', edge: targetEdges[0] });
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
        edgeTypes={edgeTypes}
        onEdgeMouseEnter={(_e, edge) =>
          CanvasStore.send({ type: 'hoverOverEdge', edgeId: edge.id })
        }
        onEdgeMouseLeave={() => CanvasStore.send({ type: 'hoverOverEdge', edgeId: undefined })}
      />
    </Box>
  );
};

export default Canvas;
