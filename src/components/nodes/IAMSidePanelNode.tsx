import { useContext } from 'react';

import { Text, Box } from '@chakra-ui/react';
import { IAMNodeContext } from 'components/nodes/IAMNodeProvider';
import { IAMNodeProps } from 'types';

/**
 * `IAMSidePanelNode` renders a generic node to be used inside the side panel
 *
 * Props:
 * - `id`: Node ID
 * - `type`: Node type that controls the node's backbone style
 * - `description`: Node description to display in the right side panel
 * - `label`: The label to display in the node.
 * - `Icon`: The Ant Design icon to display in the node.
 * - `iconName`: The name of the Ant Design icon to display in the node.
 */
const IAMSidePanelNode: React.FC<IAMNodeProps> = ({
  id,
  type,
  description,
  label,
  icon: Icon,
  iconName,
}) => {
  const { setSelectedNode, selectedNode } = useContext(IAMNodeContext);

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>): void => {
    event.dataTransfer.setData(
      'json-node-data',
      JSON.stringify({ id, type, description, label, iconName })
    );
  };

  const handleClick = (): void => {
    setSelectedNode({ id, label, description });
  };

  const isSelected = selectedNode?.id === id;

  return (
    <Box
      p={4}
      bg='white'
      shadow='sm'
      height='80px'
      textAlign='center'
      borderRadius='md'
      cursor='pointer'
      borderWidth={isSelected ? '2px' : '1px'}
      borderColor={isSelected ? 'blue.500' : 'gray.200'}
      onClick={handleClick}
      onDragStart={handleDragStart}
      _hover={{ shadow: 'md' }}
      draggable
    >
      <Icon />
      <Text>{label}</Text>
    </Box>
  );
};

export default IAMSidePanelNode;
