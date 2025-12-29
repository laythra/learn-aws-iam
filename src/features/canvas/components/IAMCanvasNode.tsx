import { useEffect, useRef, memo, useState } from 'react';

import { Flex, Text, Box, Image, Badge, Tooltip, HStack } from '@chakra-ui/react';
import { useTheme } from '@chakra-ui/react';
import { useSelector } from '@xstate/store/react';
import { Handle } from '@xyflow/react';
import { motion } from 'framer-motion';
import _ from 'lodash';

import AggregatedUsersListButton from './AggregatedUsersListButton';
import ARNIconButton from './ARNIconButton';
import DeaggregateUserNodesButton from './DeaggregateUserNodesButton';
import IAMNodeHelpTooltip from './IAMNodeHelpTooltip';
import IAMNodeInfoButton from './IAMNodeInfoButton';
import TagsIconButton from './TagsIconButton';
import { CanvasStore } from '../stores/canvas-store';
import { WithPopoverBox } from '@/components/Decorated';
import { LevelsProgressionContext } from '@/components/providers/level-actor-contexts';
import { CustomTheme } from '@/types/custom-theme';
import { IAMCodeDefinedEntity, IAMNodeEntity } from '@/types/iam-enums';
import { IAMAnyNode } from '@/types/iam-node-types';
import { StatelessStateMachineEvent } from '@/types/state-machine-event-enums';
import { generateArn, SupportedArnNodeTypes } from '@/utils/arn-generator';
import { loadLocalImage } from '@/utils/image-loader';

export interface IAMCanvasNodeProps {
  data: IAMAnyNode['data'];
  id: string;
}

const IAMCanvasNode: React.FC<IAMCanvasNodeProps> = ({ data, id }) => {
  const ref = useRef<HTMLDivElement>(null);
  const hasPulsedRef = useRef(false);

  const [selectedNodeId, isDeleting] = useSelector(
    CanvasStore,
    state => [state.context.selectedNodeId, state.context.nodeIdsWithDeletionInProgress.has(id)],
    _.isEqual
  );

  const withPopoverElementId = LevelsProgressionContext().useSelector(
    state => state.context.popover_content?.element_id
  );

  const theme = useTheme<CustomTheme>();

  const { entity, label, handles, image, content, tags, alert_message } = data;

  const resourceType = entity === IAMNodeEntity.Resource && data.resource_type;
  const isAggregatedNode = entity === IAMNodeEntity.AggregatedUsers;

  const arn = SupportedArnNodeTypes.includes(resourceType || entity)
    ? generateArn(resourceType || entity, label, data.account_id)
    : undefined;

  const isSelected = selectedNodeId === id;

  const [showCreationPulse, setShowCreationPulse] = useState(true);

  useEffect(() => {
    // a safety net in case the node unmounts and remounts, we don't want to pulse again
    if (hasPulsedRef.current) return;

    hasPulsedRef.current = true;

    const t = setTimeout(() => setShowCreationPulse(false), 8000);
    return () => clearTimeout(t);
  }, []);

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
      <WithPopoverBox ref={ref} data-element-id={id}>
        <Box position='relative'>
          {showCreationPulse && !isDeleting && (
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
              initial={{ scale: 0.85, opacity: 0.85 }}
              animate={{ scale: 1.25, opacity: 0 }}
              transition={{ duration: 3, ease: [0.2, 0.8, 0.3, 1] }}
            />
          )}

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

            {isAggregatedNode && (
              <>
                <AggregatedUsersListButton
                  nodeId={id}
                  users={data.aggregated_user_ids}
                  onOpenEvent={StatelessStateMachineEvent.IAMNodeARNOpened}
                />
                <DeaggregateUserNodesButton nodeId={id} />
              </>
            )}
          </HStack>
        </Box>
      </WithPopoverBox>
    </motion.div>
  );
};

export default memo(IAMCanvasNode);
