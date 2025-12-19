import React, { useEffect, memo } from 'react';

import { Box, useTheme } from '@chakra-ui/react';
import { useSelector } from '@xstate/store/react';
import { getBezierPath, EdgeLabelRenderer, EdgeProps, BaseEdge } from '@xyflow/react';
import { motion } from 'framer-motion';
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
    color: edgeColor = theme.colors.black,
    hovering_color: edgeHoverColor = theme.colors.blue[500],
    stroke_width: strokeWidth = 1,
    persistent_label: persistentLabel,
    show_success_pulse: showSuccessPulse,
  } = data || {};

  const isEdgeHighlighted = clickedEdgeId === id || hoveredOverEdgeId === id;

  const baseStrokeColor = edgeColor;
  const baseStrokeWidth = strokeWidth;

  const highlightStrokeColor = edgeHoverColor;
  const highlightStrokeWidth = strokeWidth + 2;

  const edgeStrokeColor = isEdgeHighlighted ? highlightStrokeColor : baseStrokeColor;
  const edgeStrokeWidth = isEdgeHighlighted ? highlightStrokeWidth : baseStrokeWidth;
  const shouldShowLabel = persistentLabel || isEdgeHighlighted;
  const animatedStrokeColor = '#38bdf8';

  const [showPulse, setShowPulse] = React.useState<boolean>(showSuccessPulse || false);

  useEffect(() => {
    if (showPulse) {
      const timeout = setTimeout(() => {
        setShowPulse(false);
      }, 7000);
      return () => clearTimeout(timeout);
    }
  }, [showPulse]);

  return (
    <>
      <g onClick={() => CanvasStore.send({ type: 'selectEdge', edgeId: id })} data-element-id={id}>
        <BaseEdge
          path={edgePath}
          style={{
            stroke: edgeStrokeColor,
            strokeWidth: edgeStrokeWidth,
          }}
        />

        {showPulse && (
          <motion.path
            d={edgePath}
            fill='none'
            strokeLinecap='round'
            initial={{
              stroke: baseStrokeColor,
              strokeWidth: baseStrokeWidth,
              opacity: 0,
            }}
            animate={{
              stroke: [baseStrokeColor, animatedStrokeColor, baseStrokeColor],
              strokeWidth: [baseStrokeWidth, highlightStrokeWidth, baseStrokeWidth],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 7,
              times: [0, 0.25 / 7, 1],
              ease: 'easeInOut',
            }}
          />
        )}
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

export default memo(IAMCanvasEdge);
