import { useContext } from 'react';

import { Flex, Text, Box, Image, Badge, Tooltip, HStack } from '@chakra-ui/react';
import { useTheme } from '@chakra-ui/react';
import { Handle } from 'reactflow';

import IAMNodeInfoButton from './IAMNodeInfoButton';
import { IAMNodeContext } from './IAMNodeProvider';
import { WithPopoverBox } from '@/components/Decorated';
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
 * @param `id` The unique identifier of the node.
 * @param `data` The node data passed from React Flow.
 */
const WithElementidIAMCanvasNode: React.FC<IAMCanvasNodeProps> = ({ data, id }) => {
  const { entity, label, handles, image, content } = data;
  const isAnUnecessaryPolicy = data.entity === IAMNodeEntity.Policy && data.unnecessary_policy;
  const resourceType = data.entity === IAMNodeEntity.Resource && data.resource_type;

  const { setSelectedNodeId, selectedNodeId } = useContext(IAMNodeContext);
  const theme = useTheme<CustomTheme>();

  const handleClick = (): void => {
    setSelectedNodeId(id);
  };

  const isSelected = selectedNodeId === id;

  return (
    <>
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
              {resourceType || entity}
            </Text>
          </Box>
        </Flex>
      </Flex>
      {content && (
        <Box>
          <IAMNodeInfoButton
            nodeId={id}
            label={label}
            codeDescription={content}
            placement='top-end'
          />
        </Box>
      )}
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
