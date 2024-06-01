import { useContext } from 'react';

import { Flex, Text, Box } from '@chakra-ui/react';
import { useTheme } from '@chakra-ui/react';
import { Handle, NodeProps } from 'reactflow';

import IAMNodeIcon from './IAMNodeIcon';
import { IAMNodeContext } from '@/components/nodes/IAMNodeProvider';
import { withPopover } from '@/decorators/withPopover';
import { IAMCanvasNodeProps } from '@/types';

/**
 * `IAMCanvasNode` renders a generic square node with a label and an icon.
 * It uses Chakra UI for styling and Ant Design icons for the icon.
 *
 * Props:
 * @param `id`: The unique identifier of the node.
 * @param `data`: The node data passed from React Flow.
 */
const IAMCanvasNode: React.FC<NodeProps> = ({ data, id }) => {
  const { description, entity, label, handles } = data as IAMCanvasNodeProps;
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
      p={4}
      bg='white'
      boxShadow='md'
      borderRadius='lg'
      position='relative'
      width='100px'
      height='100px'
      textAlign='center'
      borderWidth={isSelected ? '2px' : '1px'}
      borderColor={isSelected ? 'blue.500' : 'gray.200'}
      onClick={handleClick}
    >
      {handles.map(handle => (
        <Handle key={handle.id} {...handle} />
      ))}
      <IAMNodeIcon nodeLabel='User' />
      <Box marginTop={1}>
        <Text fontWeight='700'>{label}</Text>
      </Box>
    </Flex>
  );
};

export default withPopover(IAMCanvasNode);
