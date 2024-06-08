import React, { useCallback } from 'react';

import { Box } from '@chakra-ui/react';
import _ from 'lodash';
import ReactFlow, { Edge, Connection, Node } from 'reactflow';

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

  const handleDragOver = (event: React.DragEvent): void => {
    event.preventDefault();
  };

  const addEdge = (edge: Edge): void => {
    levelActor.send({ type: 'ADD_EDGE', edge: edge });
  };

  const setEdges = (edges: Edge[]): void => {
    levelActor.send({ type: 'SET_EDGES', edges: edges });
  };

  const addNode = (node: Node): void => {
    levelActor.send({ type: 'ADD_IAM_NODE', node: node });
  };

  const handleDrop = (event: React.DragEvent): void => {
    event.preventDefault();

    const nodeData = JSON.parse(event.dataTransfer.getData('json-node-data'));
    const canvasRect = (event.target as Element).getBoundingClientRect();

    // TODO: Handle when canvas is zoomed in/out, or simply render node in the center?
    const canvasX = event.clientX - canvasRect.left;
    const canvasY = event.clientY - canvasRect.top;

    const newNode = {
      id: nodeData['id'],
      type: 'iam-default',
      position: { x: canvasX, y: canvasY },
      data: nodeData,
    };

    levelActor.send({ type: 'ADD_IAM_NODE', node: newNode });
  };

  const onConnect = useCallback(
    (params: Connection) => {
      if (levelState.context.inside_tutorial) {
        return;
      }

      const newEdge = { ...params, id: `e-${params.source}-${params.target}` } as Edge;
      let newEdges = [...levelState.context.edges, newEdge];
      setEdges(newEdges);

      _.forOwn(levelState.getMeta(), (value, statePath) => {
        const levelMetadata = value as InsideLevelMetadata;

        const finishedTargets = _.map(levelMetadata.connection_targets, connectionTarget => {
          if (_.differenceBy(connectionTarget.required_edges, newEdges, 'id').length === 0) {
            _.forEach(connectionTarget.locked_edges, edge => {
              // We unlock all locked edges
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
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      backgroundColor='white'
      backgroundImage={DotsPattern}
      backgroundRepeat='repeat'
      position='relative'
      height='100vh'
      zIndex='auto'
    >
      <ReactFlow
        nodes={levelState.context.nodes}
        edges={levelState.context.edges}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
      />
    </Box>
  );
};

export default Canvas;
