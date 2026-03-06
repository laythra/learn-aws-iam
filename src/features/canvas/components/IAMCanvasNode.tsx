import { useEffect, memo, useState } from 'react';

import { Box, VStack } from '@chakra-ui/react';
import { useSelector } from '@xstate/store/react';
import { Handle } from '@xyflow/react';
import { motion } from 'framer-motion';
import _ from 'lodash';

import IAMNodeHelpTooltip from './IAMNodeHelpTooltip';
import NodeContent from './NodeContent';
import NodeInfoButtons, { getInfoButtonsReservedWidth } from './NodeInfoButtons';
import { CanvasStore } from '../stores/canvas-store';
import { useLevelSelector } from '@/app_shell/runtime/level-runtime';
import { TutorialPopover } from '@/app_shell/tutorial/TutorialPopover';
import { generateArn, SupportedArnNodeTypes } from '@/domain/arn-generator';
import { getCurrentRegularNodeMetrics } from '@/domain/node-metrics';
import { loadLocalImage } from '@/lib/assets/image-loader';
import { IAMNodeEntity } from '@/types/iam-enums';
import { IAMAnyNode } from '@/types/iam-node-types';

const MotionBox = motion(Box);

export interface IAMCanvasNodeProps {
  data: IAMAnyNode['data'];
  id: string;
  height?: number;
  width?: number;
}

const pulseVariants = {
  idle: { opacity: 0, scale: 1 },
  pulse: { opacity: 0, scale: 1.25 },
} as const;

const pulseInitial = { opacity: 0.85, scale: 0.85 } as const;
const pulseTransition = { duration: 2, ease: [0.2, 0.8, 0.3, 1] } as const;
const pulseBackground =
  'linear-gradient(135deg, rgba(147, 197, 253, 0.45), rgba(191, 219, 254, 0.12))';
const pulseBoxShadow = '0 8px 25px rgba(96, 165, 250, 0.25), 0 0 18px rgba(59, 130, 246, 0.2)';

const IAMCanvasNode: React.FC<IAMCanvasNodeProps> = ({ data, id, width, height }) => {
  const [imageSrc, setImageSrc] = useState<string>();
  const [selectedNodeId, isDeleting] = useSelector(
    CanvasStore,
    state => [state.context.selectedNodeId, state.context.nodeIdsWithDeletionInProgress.has(id)],
    _.isEqual
  );

  const withPopoverElementId = useLevelSelector(state => state.context.popover_content?.element_id);
  const regularNodeMetrics = getCurrentRegularNodeMetrics();
  const { entity, label, handles, image, content, tags, alert_message } = data;
  const resourceType = entity === IAMNodeEntity.Resource && data.resource_type;
  const arn = SupportedArnNodeTypes.includes(resourceType || entity)
    ? generateArn(resourceType || entity, label, data.account_id)
    : undefined;

  const isSelected = selectedNodeId === id;
  const infoButtonCount = [tags, content, arn].filter(Boolean).length;
  const contentPr = getInfoButtonsReservedWidth(infoButtonCount);

  useEffect(() => {
    loadLocalImage(image).then(setImageSrc);
  }, [image]);

  useEffect(() => {
    if (withPopoverElementId === id) {
      CanvasStore.send({ type: 'updateSelectedNodeId', nodeId: id });
    }
  }, [withPopoverElementId]);

  return (
    <MotionBox
      // Used to disable node outline, shadow and border during deletion animation, check `src/index.css`
      className={isDeleting ? 'node-deleting' : undefined}
      initial={{ scale: 0.85, opacity: 0 }}
      animate={
        isDeleting
          ? { opacity: 0, scale: 0.95, filter: 'blur(1px)', y: -100 }
          : { opacity: 1, scale: 1 }
      }
      transition={{ duration: isDeleting ? 0.5 : 0.25, ease: 'easeOut' }}
      style={{ willChange: 'opacity, transform, filter' }}
      onAnimationComplete={() => {
        if (isDeleting) {
          CanvasStore.send({ type: 'finalizeNodesDeletion', nodeIds: [id] });
        }
      }}
    >
      <TutorialPopover elementId={id}>
        <Box data-element-id={id} position='relative'>
          {handles.map(handle => (
            <Handle key={handle.id} {...handle} />
          ))}
          <MotionBox
            position='absolute'
            inset='-10px'
            borderRadius='18px'
            background={pulseBackground}
            boxShadow={pulseBoxShadow}
            filter='blur(2.5px)'
            pointerEvents='none'
            initial={pulseInitial}
            variants={pulseVariants}
            animate={!isDeleting ? 'pulse' : 'idle'}
            transition={pulseTransition}
            key={id}
          />
          <VStack
            id={id}
            spacing={0}
            justifyContent='center'
            p={3}
            pr={contentPr || 3}
            bg='white'
            boxShadow='sm'
            borderRadius='md'
            width={width ?? regularNodeMetrics.nodeWidth}
            height={height ?? regularNodeMetrics.nodeHeight}
            borderWidth='2px'
            borderColor={isSelected ? 'blue.500' : 'gray.200'}
            onClick={() => CanvasStore.send({ type: 'updateSelectedNodeId', nodeId: id })}
          >
            {alert_message && <IAMNodeHelpTooltip alertMessage={alert_message} nodeId={id} />}
            <NodeContent
              imageSrc={imageSrc}
              label={label}
              entity={entity}
              resourceType={resourceType}
              isUnnecessary={!!data.unnecessary_node}
            />
          </VStack>
          <NodeInfoButtons
            nodeId={id}
            label={label}
            entity={entity}
            tags={tags}
            content={content}
            arn={arn}
            editable={entity === IAMNodeEntity.IdentityPolicy && !!data.editable}
          />
        </Box>
      </TutorialPopover>
    </MotionBox>
  );
};

export default memo(IAMCanvasNode);
