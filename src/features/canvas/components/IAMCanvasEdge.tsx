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

  const {
    is_blocked: isEdgeBlocked,
    color: edgeColor = theme.colors.black,
    hovering_color: edgeHoverColor = theme.colors.blue[500],
    stroke_width: strokeWidth = 1,
    persistent_label: persistentLabel,
  } = data || {};

  const isEdgeHighlighted = clickedEdgeId === id || hoveredOverEdgeId === id;
  const edgeStrokeColor = isEdgeHighlighted ? edgeHoverColor : edgeColor;
  const edgeStrokeWidth = isEdgeHighlighted ? strokeWidth + 2 : strokeWidth;
  const shouldShowLabel = persistentLabel || isEdgeHighlighted;

  return (
    <>
      <g onClick={() => CanvasStore.send({ type: 'selectEdge', edgeId: id })}>
        <BaseEdge
          path={edgePath}
          style={{
            stroke: edgeStrokeColor,
            strokeWidth: edgeStrokeWidth,
            opacity: isEdgeBlocked ? 0.5 : 1,
            strokeOpacity: isEdgeBlocked ? 0.5 : 1,
          }}
        />
      </g>
      {data?.hovering_label && (
        <EdgeLabelRenderer>
          {shouldShowLabel && (
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
              {isEdgeHighlighted ? data?.hovering_label : data?.persistent_label}
            </Box>
          )}
        </EdgeLabelRenderer>
      )}
    </>
  );
};

export default IAMCanvasEdge;
