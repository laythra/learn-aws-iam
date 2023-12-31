import { useContext } from 'react';

import { Flex, Text } from '@chakra-ui/react';
import { IAMNodeContext } from 'components/nodes/IAMNodeProvider';
import { Position, Handle, NodeProps } from 'reactflow';
import { IAMNodeProps } from 'types';

/**
 * `IAMCanvasNode` renders a generic square node with a label and an icon.
 * It uses Chakra UI for styling and Ant Design icons for the icon.
 *
 * Props:
 * - `data`: The node data passed from React Flow.
 */
const IAMCanvasNode: React.FC<NodeProps> = ({ data }) => {
  const { id, description, label, icon: Icon } = data as IAMNodeProps;
  const { setSelectedNode, selectedNode } = useContext(IAMNodeContext);

  const handleClick = (): void => {
    setSelectedNode({ id, label, description });
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
      width='80px'
      height='80px'
      textAlign='center'
      borderWidth={isSelected ? '2px' : '1px'}
      borderColor={isSelected ? 'blue.500' : 'gray.200'}
      onClick={handleClick}
    >
      <Handle type='target' position={Position.Top} />
      <Text>{label}</Text>
      <Icon height={100} />
      <Handle type='source' position={Position.Bottom} />
    </Flex>
  );
};

export default IAMCanvasNode;
