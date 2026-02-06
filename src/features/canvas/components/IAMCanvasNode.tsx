import { useEffect, memo } from 'react';

import { Flex, Text, Box, Image, Badge, Tooltip, HStack } from '@chakra-ui/react';
import { useTheme } from '@chakra-ui/react';
import { useSelector } from '@xstate/store/react';
import { Handle } from '@xyflow/react';
import { motion } from 'framer-motion';
import _ from 'lodash';

import ARNIconButton from './ARNIconButton';
import IAMNodeHelpTooltip from './IAMNodeHelpTooltip';
import IAMNodeInfoButton from './IAMNodeInfoButton';
import TagsIconButton from './TagsIconButton';
import { CanvasStore } from '../stores/canvas-store';
import { useLevelSelector } from '@/app_shell/runtime/levelRuntime';
import { TutorialPopover } from '@/app_shell/tutorial/TutorialPopover';
import { loadLocalImage } from '@/lib/assets/image-loader';
import { generateArn, SupportedArnNodeTypes } from '@/lib/iam/arn-generator';
import { CustomTheme } from '@/types/custom-theme';
import { IAMCodeDefinedEntity, IAMNodeEntity } from '@/types/iam-enums';
import { IAMAnyNode } from '@/types/iam-node-types';
import { StatelessStateMachineEvent } from '@/types/state-machine-event-enums';

export interface IAMCanvasNodeProps {
  data: IAMAnyNode['data'];
  id: string;
}

const pulseVariants = {
  idle: { opacity: 0, scale: 1 },
  pulse: { opacity: 0, scale: 1.25 },
} as const;

const pulseInitial = { opacity: 0.85, scale: 0.85 } as const;
const pulseTransition = { duration: 2, ease: [0.2, 0.8, 0.3, 1] } as const;

const IAMCanvasNode: React.FC<IAMCanvasNodeProps> = ({ data, id }) => {
  const [selectedNodeId, isDeleting] = useSelector(
    CanvasStore,
    state => [state.context.selectedNodeId, state.context.nodeIdsWithDeletionInProgress.has(id)],
    _.isEqual
  );

  const withPopoverElementId = useLevelSelector(state => state.context.popover_content?.element_id);

  const theme = useTheme<CustomTheme>();

  const { entity, label, handles, image, content, tags, alert_message } = data;

  const resourceType = entity === IAMNodeEntity.Resource && data.resource_type;

  const arn = SupportedArnNodeTypes.includes(resourceType || entity)
    ? generateArn(resourceType || entity, label, data.account_id)
    : undefined;

  const isSelected = selectedNodeId === id;
  const showCreationPulse = !isDeleting;

  useEffect(() => {
    if (withPopoverElementId === id) {
      CanvasStore.send({ type: 'updateSelectedNodeId', nodeId: id });
    }
  }, [withPopoverElementId]);

  const handleClick = (): void => {
    CanvasStore.send({ type: 'updateSelectedNodeId', nodeId: id });
  };

  return (
    <motion.div
      // Used to disable node outline, shadow and border during deletion animation, check `src/index.css`
      className={isDeleting ? 'node-deleting' : undefined}
      initial={{ scale: 0.85, opacity: 0 }}
      animate={
        isDeleting
          ? { opacity: 0, scale: 0.95, filter: 'blur(1px)', y: -100 } // Slight upward movement during deletion
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
          <motion.div
            style={{
              position: 'absolute',
              inset: '-10px',
              borderRadius: '18px',
              background:
                'linear-gradient(135deg, rgba(147, 197, 253, 0.45), rgba(191, 219, 254, 0.12))',
              boxShadow: '0 8px 25px rgba(96, 165, 250, 0.25), 0 0 18px rgba(59, 130, 246, 0.2)',
              filter: 'blur(2.5px)',
              pointerEvents: 'none',
            }}
            initial={pulseInitial}
            variants={pulseVariants}
            animate={showCreationPulse ? 'pulse' : 'idle'}
            transition={pulseTransition}
            key={id}
          />
          <Flex
            id={id}
            direction='column'
            justifyContent='center'
            alignItems='center'
            p={3}
            bg='white'
            boxShadow='sm'
            borderRadius='md'
            width={theme.sizes.iamNodeWidthInPixels}
            height={theme.sizes.iamNodeHeightInPixels}
            textAlign='center'
            borderWidth='2px'
            borderColor={isSelected ? 'blue.500' : 'gray.200'}
            onClick={handleClick}
          >
            {handles.map(handle => (
              <Handle key={handle.id} {...handle} />
            ))}

            {alert_message && <IAMNodeHelpTooltip alertMessage={alert_message} />}

            <Flex width='100%' alignItems='center'>
              <Image src={loadLocalImage(image)} width='30%' mr='5%' />
              <Box width='65%' textAlign='left'>
                <HStack spacing={0}>
                  <Tooltip label={label}>
                    <Text
                      fontWeight='700'
                      fontSize='14px'
                      whiteSpace='nowrap'
                      overflow='hidden'
                      textOverflow='ellipsis'
                      fontFamily='monospace'
                    >
                      {label}
                    </Text>
                  </Tooltip>

                  {data.unnecessary_node && (
                    <Tooltip label={`This ${entity} does not serve any purpose.`} cursor='help'>
                      <Badge colorScheme='red' fontSize='12px' fontWeight='700' ml={1}>
                        !
                      </Badge>
                    </Tooltip>
                  )}
                </HStack>

                <Text fontSize='14px' whiteSpace='nowrap' overflow='hidden' textOverflow='ellipsis'>
                  {entity === IAMNodeEntity.Resource ? resourceType : entity}
                </Text>
              </Box>
            </Flex>
          </Flex>
          <HStack position='absolute' top={1} right={2}>
            {tags && (
              <TagsIconButton
                placement='top-end'
                tags={tags}
                nodeId={id}
                onOpenEvent={StatelessStateMachineEvent.IAMNodeTagsOpened}
              />
            )}

            {content && (
              <IAMNodeInfoButton
                nodeId={id}
                label={label}
                codeDescription={content}
                placement='top-end'
                editable={entity === IAMNodeEntity.Policy && data.editable}
                selectedIAMEntity={entity as IAMCodeDefinedEntity}
              />
            )}

            {arn && (
              <ARNIconButton
                nodeId={id}
                arn={arn}
                onCopyEvent={StatelessStateMachineEvent.IAMNodeARNCopied}
                onOpenEvent={StatelessStateMachineEvent.IAMNodeARNOpened}
                placement='top-end'
              />
            )}
          </HStack>
        </Box>
      </TutorialPopover>
    </motion.div>
  );
};

export default memo(IAMCanvasNode);
