import { useContext, memo, useEffect } from 'react';

import { Flex, Text, Box, Image, Badge, Tooltip, HStack } from '@chakra-ui/react';
import { useTheme } from '@chakra-ui/react';
import _ from 'lodash';
import { Edge, Handle } from 'reactflow';
import { EventFromLogic } from 'xstate';

import { IAMNodeInfoButton } from './IAMNodeInfoButton';
import { IAMNodeContext } from './IAMNodeProvider';
import { WithPopoverBox } from '@/components/Decorated';
import { LevelsProgressionContext } from '@/components/providers/LevelsProgressionProvider';
import { createEdge } from '@/factories/edge-factory';
import { EdgeConnectionObjective } from '@/machines/types';
import { type IAMAnyNodeData, type CustomTheme, IAMNodeEntity } from '@/types';
import { loadLocalImage } from '@/utils/image-loader';

export interface IAMCanvasNodeProps {
  data: IAMAnyNodeData;
  id: string;
}

/**
 * `IAMCanvasNode` renders a generic square node with a label and an icon.
 * It uses Chakra UI for styling and Ant Design icons for the icon.
 *
 * Props:
 * @param `id`: The unique identifier of the node.
 * @param `data`: The node data passed from React Flow.
 */
const WithElementidIAMCanvasNode: React.FC<IAMCanvasNodeProps> = ({ data, id }) => {
  const { entity, label, handles, image, code } = data;
  const isAnUnecessaryPolicy = data.entity === IAMNodeEntity.Policy && data.unnecessary_policy;
  const resourceType = data.entity === IAMNodeEntity.Resource && data.resource_type;

  const { setSelectedNodeId, selectedNodeId } = useContext(IAMNodeContext);
  const theme = useTheme<CustomTheme>();
  const levelActor = LevelsProgressionContext.useActorRef();

  const handleClick = (): void => {
    setSelectedNodeId(id);
  };

  const updateEdges = (newEdges: Edge[]): void => {
    const levelContext = levelActor.getSnapshot().context;
    let updatedEdges = [...levelContext.edges, ...newEdges];
    const finishedEdgeConnectionObjectives: EdgeConnectionObjective[] = [];

    levelContext.edges_connection_objectives.forEach(objective => {
      if (_.differenceBy(objective.required_edges, newEdges, 'id').length === 0) {
        updatedEdges = [...updatedEdges, ...objective.locked_edges];
        finishedEdgeConnectionObjectives.push(objective);
      }
    });

    const stateMachine = levelActor.getSnapshot().machine;
    levelActor.send({ type: 'SET_EDGES', edges: updatedEdges });
    finishedEdgeConnectionObjectives.forEach(objective => {
      levelActor.send({ type: objective.on_finish_event } as EventFromLogic<typeof stateMachine>);
    });
  };

  if (data.entity === IAMNodeEntity.User) {
    useEffect(() => {
      const associatedEdges = data.associated_policies.map(policyId =>
        createEdge({ target: id, source: policyId })
      );

      updateEdges(associatedEdges);
    }, [data.associated_policies]);
  }

  const isSelected = selectedNodeId === id;

  return (
    <Flex
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
      {handles.map(handle => (
        <Handle key={handle.id} {...handle} />
      ))}

      <Flex width='100%' alignItems='center'>
        <Image src={loadLocalImage(image)} width='25%' objectFit='cover' marginRight='8%' />
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
            {resourceType || entity}
          </Text>
        </Box>
        {code && (
          <Box flex='none'>
            <IAMNodeInfoButton label={label} codeDescription={code} placement='top-end' />
          </Box>
        )}
      </Flex>
    </Flex>
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
