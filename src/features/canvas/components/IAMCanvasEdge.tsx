import React from 'react';

import { Box, useTheme } from '@chakra-ui/react';
import { useSelector } from '@xstate/store/react';
import { getBezierPath, EdgeLabelRenderer, EdgeProps, BaseEdge } from '@xyflow/react';
import _ from 'lodash';

import { CanvasStore } from '../stores/canvas-store';
import { CustomTheme, IAMEdge } from '@/types';

const IAMCanvasEdge: React.FC<EdgeProps<IAMEdge>> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}) => {
  const theme = useTheme<CustomTheme>();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const [clickedEdgeId, hoveredOverEdgeId] = useSelector(
    CanvasStore,
    state => [state.context.selectedEdgeId, state.context.hoveredOverEdgeId],
    _.isEqual
  );

  const edgeColor = data?.color || theme.colors.black;
  const edgeHoverColor = data?.hovering_color || theme.colors.blue[500];
  const strokeWidth = data?.stroke_width || 1;
  const highlightEdge = clickedEdgeId === id || hoveredOverEdgeId === id;
  const edgeStrokeColor = highlightEdge ? edgeHoverColor : edgeColor; // Blue when hovered, black otherwise
  const edgeStrokeWidth = highlightEdge ? strokeWidth + 2 : strokeWidth; // Thicker when hovered

  return (
    <>
      <g onClick={() => CanvasStore.send({ type: 'selectEdge', edgeId: id })}>
        <BaseEdge
          path={edgePath}
          style={{
            stroke: edgeStrokeColor,
            strokeWidth: edgeStrokeWidth,
          }}
        />
      </g>
      <EdgeLabelRenderer>
        {(highlightEdge || data?.label_always_visible) && (
          <Box
            position='absolute'
            transform={`translate(-50%, -50%) translate(${labelX}px,${labelY}px)`}
            background='white'
            borderRadius='4px'
            padding='1px'
            pointerEvents='all'
            fontSize='11px'
            fontWeight='bold'
            zIndex={10}
          >
            {data?.hovering_label || 'Placeholder Tooltip'}
          </Box>
        )}
      </EdgeLabelRenderer>
    </>
  );
};

export default IAMCanvasEdge;
