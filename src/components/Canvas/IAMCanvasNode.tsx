import { useContext } from 'react';

import { Flex, Text, Box, Image, Badge, Tooltip } from '@chakra-ui/react';
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
      width='180px'
      height='60px'
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
          <Text fontWeight='700' fontSize='12px'>
            Laith
            <Tooltip label='There is an error' aria-label='A tooltip' cursor='help'>
              <Badge colorScheme='red' ml={1} fontSize='12px' fontWeight='700'>
                !
              </Badge>
            </Tooltip>
          </Text>
          <Text fontSize='12px'>{label}</Text>
        </Box>
        <Box flex='none'>
          <IAMNodeInfoButton label={label} codeDescription={code} placement='top-end' />
        </Box>
      </Flex>
    </Flex>
  );
};

export default withPopover(IAMCanvasNode);
