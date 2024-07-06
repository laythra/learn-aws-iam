import { useContext, useRef, useEffect } from 'react';

import { Flex, Text, Box, Image, Badge, Tooltip, HStack, Icon } from '@chakra-ui/react';
import { Handle, NodeProps } from 'reactflow';

import { IAMNodeInfoButton } from './IAMNodeInfoButton';
import { IAMNodeContext } from '@/components/Canvas/IAMNodeProvider';
import { withPopover } from '@/decorators/withPopover';
import type { IAMCanvasNodeProps as CanvasNodeProps } from '@/types';

// TODO: Not the most ideal naming, fix this
export interface IAMCanvasNodeProps extends NodeProps {
  data: CanvasNodeProps;
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
const IAMCanvasNode: React.FC<IAMCanvasNodeProps> = ({ data, id }) => {
  const { description, entity, label, handles, image, code } = data;
  const { setSelectedNode, selectedNode } = useContext(IAMNodeContext);

  const handleClick = (): void => {
    setSelectedNode({ id, label, entity, description });
  };

  const isSelected = selectedNode?.id === id;

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
      width='225px'
      height='75px'
      textAlign='center'
      borderWidth='2px'
      borderColor={isSelected ? 'blue.500' : 'gray.200'}
      onClick={handleClick}
    >
      {handles.map(handle => (
        <Handle key={handle.id} {...handle} />
      ))}
      <Flex width='100%' alignItems='center'>
        <Image
          src={require(`@/assets/images/${image}.png`)}
          width='25%'
          objectFit='cover'
          marginRight='8%'
        />
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
            {false && ( // Hiding badge for now
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
          <Text fontSize='14px'>{entity}</Text>
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

export default withPopover(IAMCanvasNode);
