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

  return (
    <>
      <BaseEdge path={edgePath} />
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
