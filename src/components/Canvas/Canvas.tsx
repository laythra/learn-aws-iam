import React, { useCallback, useEffect, useState } from 'react';

import { Box } from '@chakra-ui/react';
import _ from 'lodash';
import ReactFlow, {
  Edge,
  Connection,
  useNodesState,
  useEdgesState,
  ReactFlowInstance,
} from 'reactflow';
import { EventFromLogic } from 'xstate';

import { LevelsProgressionContext } from '../levels_progression/LevelsProgressionProvider';
import DotsPattern from '@/assets/images/dots_pattern.svg';
import IAMCanvasNode from '@/components/Canvas/IAMCanvasNode';
import { GenericInsideLevelMetadata } from '@/machines/types';
import { getEdgeName } from '@/utils/names';
import storage from '@/utils/storage';

import 'reactflow/dist/style.css';

const nodeTypes = {
  iam_default: IAMCanvasNode,
};

const Canvas: React.FC = () => {
  const levelState = LevelsProgressionContext.useSelector(state => state);
  const levelActor = LevelsProgressionContext.useActorRef();

  const [nodesState, setNodesState, onNodesChange] = useNodesState(levelState.context.nodes);
  const [edgesState, setEdgesState, onEdgesChange] = useEdgesState(levelState.context.edges);

  const [rfInstance, setRfInstance] = useState<ReactFlowInstance>();

  const setEdges = (edges: Edge[]): void => {
    levelActor.send({ type: 'SET_EDGES', edges: edges });
  };

  useEffect(() => {
    setEdgesState(levelState.context.edges);
  }, [levelState.context.edges]);

  useEffect(() => {
    setNodesState(levelState.context.nodes);
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

      let newEdge;
      if (templateEdge) {
        newEdge = templateEdge;
      } else {
        // Create a generic edge
        newEdge = {
          ...params,
          id: edgeName,
          label: 'Attached to',
          labelStyle: { fill: 'black', fontWeight: 700 },
        } as Edge;
      }

      let newEdges = [...levelState.context.edges, newEdge];
      setEdges(newEdges);

      _.forOwn(levelState.getMeta(), (value, statePath) => {
        const levelMetadata = value as GenericInsideLevelMetadata;

        const finishedTargets = _.map(levelMetadata.connection_targets, connectionTarget => {
          if (_.differenceBy(connectionTarget.required_edges, newEdges, 'id').length === 0) {
            // We unlock all locked edges
            _.forEach(connectionTarget.locked_edges, edge => {
              newEdges = [...newEdges, edge];
            });

            setEdges(newEdges);
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

  const handleInit = useCallback((instance: ReactFlowInstance) => {
    if (!rfInstance) {
      setRfInstance(instance);
    }

    const rawFlowState = storage.getKey('flow_state');
    if (!rawFlowState) {
      return;
    }

    const flowState = JSON.parse(rawFlowState);

    setNodesState(flowState.nodes);
    setEdgesState(flowState.edges);
  }, []);

  return (
    <Box
      backgroundColor='white'
      backgroundImage={DotsPattern}
      backgroundRepeat='repeat'
      position='relative'
      height='100vh'
    >
      <ReactFlow
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodes={nodesState}
        edges={edgesState}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onInit={handleInit}
      />
    </Box>
  );
};

export default Canvas;
