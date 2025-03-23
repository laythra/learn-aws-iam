import { useEffect, useState } from 'react';

import { Flex, Text, Box, Image, Badge, Tooltip, HStack } from '@chakra-ui/react';
import { useTheme } from '@chakra-ui/react';
import { useSelector } from '@xstate/store/react';
import { useAnimate } from 'framer-motion';
import _ from 'lodash';
import { Handle } from 'reactflow';

import ARNIconButton from './ARNIconButton';
import IAMNodeInfoButton from './IAMNodeInfoButton';
import { ShimmerBackground } from './ShimmerBackground';
import { CanvasStore } from '../stores/canvas-store';
import { WithPopoverBox } from '@/components/Decorated';
import { type IAMAnyNodeData, type CustomTheme, IAMNodeEntity } from '@/types';
import { StatelessStateMachineEvent } from '@/types/state-machine-event-enums';
import { generateArn } from '@/utils/arn-generator';
import { loadLocalImage } from '@/utils/image-loader';

export interface IAMCanvasNodeProps {
  data: IAMAnyNodeData;
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
const WithElementidIAMCanvasNode: React.FC<IAMCanvasNodeProps> = ({ data, id }) => {
  const { entity, label, handles, image, content, animations } = data;
  const isAnUnecessaryPolicy = data.entity === IAMNodeEntity.Policy && data.unnecessary_node;
  const resourceType = data.entity === IAMNodeEntity.Resource && data.resource_type;
  const [selectedNodeId, openedNodeId] = useSelector(
    CanvasStore,
    state => [state.context.selectedNodeId, state.context.openedNodeId],
    _.isEqual
  );

  const [animationsState, setAnimationsState] = useState<Record<string, AnimationState>>({});
  const [scope, animate] = useAnimate();

  const theme = useTheme<CustomTheme>();

  const handleClick = (): void => {
    CanvasStore.send({ type: 'updateSelectedNodeId', nodeId: id });
  };

  const isSelected = selectedNodeId === id;

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
              {isAnUnecessaryPolicy && (
                <Tooltip
                  label={`This ${entity} does not serve any purpose`}
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
        <ARNIconButton
          arn={generateArn(resourceType || entity, label, data.account_id)}
          onCopyEvent={StatelessStateMachineEvent.IAMNodeARNCopied}
          onOpenEvent={StatelessStateMachineEvent.IAMNodeARNOpened}
          placement='top-end'
        />
        {content && (
          <IAMNodeInfoButton
            nodeId={id}
            opened={openedNodeId === id}
            label={label}
            codeDescription={content}
            placement='top-end'
            editable={data.entity === IAMNodeEntity.Policy && data.editable}
          />
        )}
      </HStack>
    </>
  );
};

const IAMCanvasNode: React.FC<IAMCanvasNodeProps> = ({ data, id }) => {
  return (
    <WithPopoverBox elementid={id}>
      <WithElementidIAMCanvasNode data={data} id={id} />
    </WithPopoverBox>
  );
};

export default IAMCanvasNode;
