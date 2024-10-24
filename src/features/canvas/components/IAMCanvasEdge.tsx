import React from 'react';

import { Box } from '@chakra-ui/react';
import { useSelector } from '@xstate/store/react';
import { getBezierPath, EdgeLabelRenderer, EdgeProps, BaseEdge } from 'reactflow';

import { CanvasStore } from '../stores/canvas-store';
import { IAMEdgeData } from '@/types';

const IAMCanvasEdge: React.FC<EdgeProps<IAMEdgeData>> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const clickedEdgeId = useSelector(CanvasStore, state => state.context.clickedEdgeId);
  const highlightEdge = data?.is_hovering || clickedEdgeId === id;
  const edgeStrokeColor = highlightEdge ? '#3b82f6' : '#000'; // Blue when hovered, black otherwise
  const edgeStrokeWidth = highlightEdge ? 3 : 1; // Thicker when hovered

  return (
    <>
      <g onClick={() => CanvasStore.send({ type: 'clickEdge', edgeId: id })}>
        <BaseEdge
          path={edgePath}
          style={{
            stroke: edgeStrokeColor,
            strokeWidth: edgeStrokeWidth,
          }}
        />
      </g>
      <EdgeLabelRenderer>
        {highlightEdge && (
          <Box
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              background: 'white',
              padding: '1px',
              pointerEvents: 'all',
              fontSize: '11px',
              fontWeight: 'bold',
            }}
          >
            {data?.hovering_label || 'Placeholder Tooltip'}
          </Box>
        )}
      </EdgeLabelRenderer>
    </>
  );
};

export default IAMCanvasEdge;
