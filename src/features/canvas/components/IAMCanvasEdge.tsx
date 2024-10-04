import React from 'react';

import { Box } from '@chakra-ui/react';
import { getBezierPath, EdgeLabelRenderer, EdgeProps, BaseEdge } from 'reactflow';

import { IAMEdgeData } from '@/types';

const IAMCanvasEdge: React.FC<EdgeProps<IAMEdgeData>> = ({
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

  const edgeStrokeColor = data?.is_hovering ? '#3b82f6' : '#000'; // Blue when hovered, black otherwise
  const edgeStrokeWidth = data?.is_hovering ? 3 : 1; // Thicker when hovered

  return (
    <>
      <BaseEdge
        path={edgePath}
        style={{
          stroke: edgeStrokeColor,
          strokeWidth: edgeStrokeWidth,
        }}
      />
      <EdgeLabelRenderer>
        {data?.is_hovering && (
          <Box
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              background: 'white',
              padding: '1px',
              pointerEvents: 'all',
              fontSize: '10px',
            }}
          >
            {
              // TODO: Read tooltip text from data
              'Placeholder Tooltip'
            }
          </Box>
        )}
      </EdgeLabelRenderer>
    </>
  );
};

export default IAMCanvasEdge;
