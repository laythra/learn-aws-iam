import React, { useCallback, useEffect } from 'react';

import { Box } from '@chakra-ui/react';
import _ from 'lodash';
import ReactFlow, { Edge, Connection, useNodesState, useEdgesState } from 'reactflow';

import { LevelsProgressionContext } from './levels_progression/LevelsProgressionProvider';
import DotsPattern from '@/assets/images/dots_pattern.svg';
import IAMCanvasNode from '@/components/nodes/IAMCanvasNode';
import { EventData, InsideLevelMetadata } from '@/machines/types';

import 'reactflow/dist/style.css';

const nodeTypes = {
  iam_default: IAMCanvasNode,
};

const Canvas: React.FC = () => {
  const levelState = LevelsProgressionContext.useSelector(state => state);
  const levelActor = LevelsProgressionContext.useActorRef();

  const [nodesState, setNodesState, onNodesChange] = useNodesState(levelState.context.nodes);
  const [edgesState, setEdgesState, onEdgesChange] = useEdgesState(levelState.context.edges);

  const setEdges = (edges: Edge[]): void => {
    levelActor.send({ type: 'SET_EDGES', edges: edges });
  };

  useEffect(() => {
    setEdgesState(levelState.context.edges);
  }, [levelState.context.edges]);

  useEffect(() => {
    setNodesState(levelState.context.nodes);
  }, [levelState.context.nodes]);

  // const handleDrop = (event: React.DragEvent): void => {
  //   event.preventDefault();

  //   const nodeData = JSON.parse(event.dataTransfer.getData('json-node-data'));
  //   const canvasRect = (event.target as Element).getBoundingClientRect();

  //   // TODO: Handle when canvas is zoomed in/out, or simply render node in the center?
  //   const canvasX = event.clientX - canvasRect.left;
  //   const canvasY = event.clientY - canvasRect.top;

  //   const newNode = {
  //     id: nodeData['id'],
  //     type: 'iam-default',
  //     position: { x: canvasX, y: canvasY },
  //     data: nodeData,
  //   };

  //   levelActor.send({ type: 'ADD_IAM_NODE', node: newNode });
  // };

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        id: `e-${params.source}-${params.target}`,
        label: 'Attached to', // TODO: Make this dynamic
        labelStyle: { fill: 'black', fontWeight: 700 },
      } as Edge;
      let newEdges = [...levelState.context.edges, newEdge];
      setEdges(newEdges);

      _.forOwn(levelState.getMeta(), (value, statePath) => {
        const levelMetadata = value as InsideLevelMetadata;

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
          levelActor.send({ type: actionName } as EventData);
        }
      });
    },
    [levelState]
  );

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
      />
    </Box>
  );
};

export default Canvas;
