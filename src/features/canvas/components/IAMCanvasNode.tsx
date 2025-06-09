import { useEffect, useRef, useState, memo } from 'react';

import { Flex, Text, Box, Image, Badge, Tooltip, HStack } from '@chakra-ui/react';
import { useTheme } from '@chakra-ui/react';
import { useSelector } from '@xstate/store/react';
import { Handle } from '@xyflow/react';
import { useAnimate } from 'framer-motion';
import _ from 'lodash';

import ARNIconButton from './ARNIconButton';
import IAMNodeInfoButton from './IAMNodeInfoButton';
import { ShimmerBackground } from './ShimmerBackground';
import TagsIconButton from './TagsIconButton';
import { CanvasStore } from '../stores/canvas-store';
import { WithPopoverBox } from '@/components/Decorated';
import { LevelsProgressionContext } from '@/components/providers/LevelsProgressionProvider';
import { type CustomTheme, IAMAnyNode, IAMCodeDefinedEntity, IAMNodeEntity } from '@/types';
import { StatelessStateMachineEvent } from '@/types/state-machine-event-enums';
import { generateArn, SupportedArnNodeTypes } from '@/utils/arn-generator';
import { loadLocalImage } from '@/utils/image-loader';

export interface IAMCanvasNodeProps {
  data: IAMAnyNode['data'];
  id: string;
}

enum AnimationState {
  Pending,
  Playing,
  Finished,
}

/**
 * `IAMCanvasNode` renders a generic square node with a label and an icon.
 * It uses Chakra UI for styling and Ant Design icons for the icon.
 *
 * Props:
 * @param `id` The unique identifier of the node.
 * @param `data` The node data passed from React Flow.
 */
export const WithElementidIAMCanvasNode: React.FC<IAMCanvasNodeProps> = ({ data, id }) => {
  const { entity, label, handles, image, content, animations, tags } = data;
  const resourceType = data.entity === IAMNodeEntity.Resource && data.resource_type;
  const selectedNodeId = useSelector(CanvasStore, state => state.context.selectedNodeId);

  const [animationsState, setAnimationsState] = useState<Record<string, AnimationState>>({});
  const [scope, animate] = useAnimate();

  const theme = useTheme<CustomTheme>();

  const handleClick = (): void => {
    CanvasStore.send({ type: 'updateSelectedNodeId', nodeId: id });
  };

  const isSelected = selectedNodeId === id;
  const arn = SupportedArnNodeTypes.includes(resourceType || entity)
    ? generateArn(resourceType || entity, label, data.account_id)
    : undefined;

  useEffect(() => {
    // TODO: Figure out a better way to handle animations
    const playAnimations = async (): Promise<void> => {
      if (!data.animations) return;

      // Fetch animations that haven't been played yet
      const animationsToPlay = _.pickBy(data.animations, (value, key) => !animationsState[key]);

      if (Object.keys(animationsToPlay).length > 0) {
        setAnimationsState(currentState => ({
          ...currentState,
          ...Object.fromEntries(
            Object.keys(animationsToPlay).map(key => [key, AnimationState.Playing])
          ),
        }));
      }

      // Play animations
      for (const pendingAnimations of Object.values(animationsToPlay)) {
        await Promise.all(
          pendingAnimations.map(({ element_class, keyframes, options }) =>
            animate(element_class, keyframes, options)
          )
        );
      }

      setAnimationsState(currentState => ({
        ...currentState,
        ...Object.fromEntries(
          Object.keys(animationsToPlay).map(key => [key, AnimationState.Finished])
        ),
      }));
    };

    playAnimations();
  }, [animations]);

  return (
    <>
      <Flex
        ref={scope}
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
      >
        <ShimmerBackground className='shimmer' />
        {handles.map(handle => (
          <Handle key={handle.id} {...handle} />
        ))}

        <Flex width='100%' alignItems='center'>
          <Image src={loadLocalImage(image)} width='25%' objectFit='cover' mr='5%' />
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
                  label={`This ${entity} does not serve any purpose, click to remove it.`}
                  aria-label='A tooltip'
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
    </>
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
