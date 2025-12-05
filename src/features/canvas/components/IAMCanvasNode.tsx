import { useEffect, useRef, memo, useState } from 'react';

import { Flex, Text, Box, Image, Badge, Tooltip, HStack } from '@chakra-ui/react';
import { useTheme } from '@chakra-ui/react';
import { useSelector } from '@xstate/store/react';
import { Handle } from '@xyflow/react';
import { motion } from 'framer-motion';

import ARNIconButton from './ARNIconButton';
import IAMNodeInfoButton from './IAMNodeInfoButton';
import TagsIconButton from './TagsIconButton';
import { CanvasStore } from '../stores/canvas-store';
import { WithPopoverBox } from '@/components/Decorated';
import { LevelsProgressionContext } from '@/components/providers/level-actor-contexts';
import { type CustomTheme, IAMAnyNode, IAMCodeDefinedEntity, IAMNodeEntity } from '@/types';
import { StatelessStateMachineEvent } from '@/types/state-machine-event-enums';
import { generateArn, SupportedArnNodeTypes } from '@/utils/arn-generator';
import { loadLocalImage } from '@/utils/image-loader';

export interface IAMCanvasNodeProps {
  data: IAMAnyNode['data'];
  id: string;
}

const MotionFlex = motion(Flex);

/**
 * `IAMCanvasNode` renders a generic square node with a label and an icon.
 * It uses Chakra UI for styling and Ant Design icons for the icon.
 *
 * Props:
 * @param `id` The unique identifier of the node.
 * @param `data` The node data passed from React Flow.
 */
export const WithElementidIAMCanvasNode: React.FC<IAMCanvasNodeProps> = ({ data, id }) => {
  const { entity, label, handles, image, content, tags } = data;
  const resourceType = data.entity === IAMNodeEntity.Resource && data.resource_type;
  const selectedNodeId = useSelector(CanvasStore, state => state.context.selectedNodeId);

  const theme = useTheme<CustomTheme>();

  const handleClick = (): void => {
    CanvasStore.send({ type: 'updateSelectedNodeId', nodeId: id });
  };

  const isSelected = selectedNodeId === id;
  const arn = SupportedArnNodeTypes.includes(resourceType || entity)
    ? generateArn(resourceType || entity, label, data.account_id)
    : undefined;

  const [showCreationPulse, setShowCreationPulse] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowCreationPulse(false), 8000);
    return () => clearTimeout(t);
  }, []);

  return (
    <Box position='relative'>
      {showCreationPulse && (
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
            zIndex: 0,
          }}
          initial={{ scale: 0.85, opacity: 0.85 }}
          animate={{ scale: 1.25, opacity: 0 }}
          transition={{ duration: 3, ease: [0.2, 0.8, 0.3, 1] }}
        />
      )}

      <MotionFlex
        id={id}
        direction='column'
        justifyContent='center'
        alignItems='center'
        p={3}
        bg='white'
        boxShadow='sm'
        borderRadius='md'
        position='relative'
        width={theme.sizes.iamNodeWidthInPixels}
        height={theme.sizes.iamNodeHeightInPixels}
        textAlign='center'
        borderWidth='2px'
        borderColor={isSelected ? 'blue.500' : 'gray.200'}
        onClick={handleClick}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        zIndex={1}
      >
        {handles.map(handle => (
          <Handle key={handle.id} {...handle} />
        ))}

        <Flex width='100%' alignItems='center'>
          <Image src={loadLocalImage(image)} width='30%' objectFit='cover' mr='5%' />
          <Box width='65%' textAlign='left'>
            <HStack spacing={0}>
              <Tooltip label={label}>
                <Text
                  fontWeight='700'
                  fontSize='14px'
                  whiteSpace='nowrap'
                  textOverflow='ellipsis'
                  overflow='hidden'
                  fontFamily='monospace'
                >
                  {label}
                </Text>
              </Tooltip>
              {data.unnecessary_node && (
                <Tooltip
                  label={`
                    This ${entity} does not serve any purpose.
                    Highlight it and press the delete key to remove it.
                  `}
                  aria-label='Unnecessary node warning'
                  cursor='help'
                  placement='top'
                >
                  <Badge colorScheme='red' fontSize='12px' fontWeight='700' ml={1}>
                    !
                  </Badge>
                </Tooltip>
              )}
            </HStack>
            <Text fontSize='14px' whiteSpace='nowrap' overflow='hidden' textOverflow='ellipsis'>
              {entity == IAMNodeEntity.Resource ? resourceType : entity}
            </Text>
          </Box>
        </Flex>
      </MotionFlex>

      <HStack position='absolute' top={1} right={2} zIndex={2}>
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
            editable={data.entity === IAMNodeEntity.Policy && data.editable}
            selectedIAMEntity={data.entity as IAMCodeDefinedEntity}
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
  );
};

const IAMCanvasNode: React.FC<IAMCanvasNodeProps> = ({ data, id }) => {
  const ref = useRef<HTMLDivElement>(null);
  const withPopoverElementId = LevelsProgressionContext().useSelector(
    state => state.context.popover_content?.element_id
  );

  useEffect(() => {
    if (withPopoverElementId == id) {
      CanvasStore.send({ type: 'updateSelectedNodeId', nodeId: id });
    }
  }, [withPopoverElementId]);

  return (
    <WithPopoverBox data-element-id={id} ref={ref}>
      <WithElementidIAMCanvasNode data={data} id={id} />
    </WithPopoverBox>
  );
};

export default memo(IAMCanvasNode);
