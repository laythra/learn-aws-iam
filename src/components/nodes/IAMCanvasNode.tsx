import { useContext } from 'react';

import { Flex, Text, Box } from '@chakra-ui/react';
import { IAMNodeContext } from 'components/nodes/IAMNodeProvider';
import { Position, Handle, NodeProps } from 'reactflow';
import { IAMNodeProps } from 'types';

import IAMNodeIcon from './IAMNodeIcon';

/**
 * `IAMCanvasNode` renders a generic square node with a label and an icon.
 * It uses Chakra UI for styling and Ant Design icons for the icon.
 *
 * Props:
 * - `data`: The node data passed from React Flow.
 */
const IAMCanvasNode: React.FC<NodeProps> = ({ data }) => {
  const { id, description, entity, label } = data as IAMNodeProps;
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
      width='100px'
      height='100px'
      textAlign='center'
      borderWidth={isSelected ? '2px' : '1px'}
      borderColor={isSelected ? 'blue.500' : 'gray.200'}
      onClick={handleClick}
    >
      <Handle type='target' position={Position.Top} />
      <IAMNodeIcon nodeLabel='User' />
      <Box marginTop={1}>
        <Text fontWeight='700'>{label}</Text>
      </Box>
      <Handle type='source' position={Position.Bottom} />
    </Flex>
  );
};

export default IAMCanvasNode;
