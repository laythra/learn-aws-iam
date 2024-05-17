import React, { useCallback } from 'react';

import { Box } from '@chakra-ui/react';
import { useTheme } from '@chakra-ui/react';
import _ from 'lodash';
import ReactFlow, { useNodesState, useEdgesState, addEdge, Edge, Connection } from 'reactflow';
import styled from 'styled-components';

import { LevelsProgressionContext } from './levels_progression/LevelsProgressionProvider';
import Logo from './Logo';
import DotsPattern from '@/assets/images/dots_pattern.svg';
import IAMCanvasNode from '@/components/nodes/IAMCanvasNode';
import { InsideLevelMetadata } from '@/machines/types';

const CanvasBackground = styled(Box)`
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: #000;
  background-image: url(${DotsPattern});
  background-repeat: repeat;
  background-color: transparent;
`;

const nodeTypes = {
  iam_default: IAMCanvasNode,
};

const Canvas: React.FC = () => {
  const theme = useTheme();
  const levelState = LevelsProgressionContext.useSelector(state => state);
  const levelActor = LevelsProgressionContext.useActorRef();
  const initialEdges = [] as Edge[];

  const [nodes, setNodes, onNodesChange] = useNodesState(levelState.context.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const handleDragOver = (event: React.DragEvent): void => {
    event.preventDefault();
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

    setNodes(oldNodes => [...oldNodes, newNode]);
  };

  const onConnect = useCallback(
    (params: Connection) => {
      if (levelState.context.inside_tutorial) {
        return;
      }

      let newEdges = addEdge({ ...params, id: `e-${params.source}-${params.target}` }, edges);
      _.forOwn(levelState.getMeta(), (value, statePath) => {
        const levelMetadata = value as InsideLevelMetadata;

        _.forEach(levelMetadata.connection_targets, connectionTarget => {
          if (_.differenceBy(connectionTarget.required_edges, newEdges, 'id').length === 0) {
            // const action = levelState.context.metadata_keys[statePath];
            // levelActor.send({ type: action } as EventData);

            _.forEach(connectionTarget.locked_edges, edge => {
              // We unlock all locked edges
              newEdges = addEdge(edge, newEdges);
            });

            // TODO: Progress to next state if necessary
          }
        });
      });

      setEdges(newEdges);
    },
    [levelState]
  );

  return (
    <CanvasBackground onDragOver={handleDragOver} onDrop={handleDrop}>
      <Box position='relative' height='100%' width='100%' zIndex={theme.zIndices.popover}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
        />
      </Box>
      <Logo />
    </CanvasBackground>
  );
};

export default Canvas;
