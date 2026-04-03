import React from 'react';

import { useTheme } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  ConnectionMode,
  useReactFlow,
  Controls,
} from '@xyflow/react';

import { AccountCanvasNode } from './AccountCanvasNode';
import IAMCanvasEdge from './IAMCanvasEdge';
import IAMCanvasNode from './IAMCanvasNode';
import { ResetZoomButton } from './ResetZoomButton';
import { useCanvas } from '../hooks/useCanvas';
import { CanvasStore } from '../stores/canvas-store';
import { CustomTheme } from '@/types/custom-theme';
import '@xyflow/react/dist/style.css';

const NODE_TYPES = {
  policy: IAMCanvasNode,
  user: IAMCanvasNode,
  iam_group: IAMCanvasNode,
  role: IAMCanvasNode,
  resource: IAMCanvasNode,
  account: AccountCanvasNode,
  ou: IAMCanvasNode,
  scp: IAMCanvasNode,
  resource_policy: IAMCanvasNode,
};

const EDGE_TYPES = {
  default: IAMCanvasEdge,
};

const Canvas: React.FC = () => {
  const theme = useTheme<CustomTheme>();
  const { nodesState, edgesState, onConnect, onEdgeDelete, onNodeDelete, setRfInstance } =
    useCanvas();

  const { setViewport } = useReactFlow();

  const nodeTypes = React.useMemo(() => NODE_TYPES, []);
  const edgeTypes = React.useMemo(() => EDGE_TYPES, []);

  return (
    <Box h='100vh' w='100%' pt={theme.sizes.navbarHeightInPixels}>
      <ReactFlow
        onNodesChange={changes => {
          if (changes.some(change => change.type === 'remove')) {
            return;
          }

          CanvasStore.send({ type: 'changeNodesState', changes });
          if (!changes.some(change => change.type === 'add')) return;

          setViewport({ x: 0, y: 0, zoom: 1 }, { duration: 300 });
        }}
        onEdgesChange={changes => {
          if (changes.some(change => change.type === 'remove')) {
            return;
          }

          CanvasStore.send({ type: 'changeEdgesState', changes });
          if (!changes.some(change => change.type === 'add')) return;

          setViewport({ x: 0, y: 0, zoom: 1 }, { duration: 300 });
        }}
        onInit={rfi => setRfInstance(rfi)}
        nodes={nodesState}
        edges={edgesState}
        connectionMode={ConnectionMode.Loose}
        onConnect={onConnect}
        onEdgesDelete={onEdgeDelete}
        onNodesDelete={onNodeDelete}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        zoomOnDoubleClick={false}
        snapToGrid
        onEdgeMouseEnter={(_e, edge) =>
          CanvasStore.send({ type: 'hoverOverEdge', edgeId: edge.id })
        }
        onEdgeMouseLeave={() => CanvasStore.send({ type: 'hoverOverEdge', edgeId: undefined })}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      >
        <Background color='#ccc' variant={BackgroundVariant.Dots} size={2} gap={14} />
        <Controls position='bottom-right' showZoom={false} showInteractive={false}>
          <ResetZoomButton />
        </Controls>
      </ReactFlow>
    </Box>
  );
};

export default Canvas;
