import { useContext } from 'react';

import { Text, Box, Flex, Tooltip } from '@chakra-ui/react';

import IAMNodeIcon from './IAMNodeIcon';
import { IAMNodeContext } from '@/components/nodes/IAMNodeProvider';
import { IAMNodeProps } from '@/types';

/**
 * `IAMSidePanelNode` renders a generic node to be used inside the side panel
 *
 * Props:
 * - `id`: Node ID
 * - `entity`: The IAM node class to render, e.g. User, Group, Role, etc.
 * - `description`: Node description to display in the right side panel
 * - `label`: The label to display in the node.
 */
const IAMSidePanelNode: React.FC<IAMNodeProps> = ({ id, label, entity, description, content }) => {
  const { setSelectedNode, selectedNode } = useContext(IAMNodeContext);

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>): void => {
    event.dataTransfer.setData('json-node-data', JSON.stringify({ id, description, label }));
  };

  const handleClick = (): void => {
    setSelectedNode({ id, label, entity, description, content });
  };

  const isSelected = selectedNode?.id === id;

  return (
    <Tooltip label={entity} aria-label={entity}>
      <Flex
        direction='column'
        justifyContent='center'
        alignItems='center'
        p={2}
        bg='white'
        shadow='sm'
        height='80px'
        borderRadius='md'
        cursor='pointer'
        borderWidth={isSelected ? '2px' : '1px'}
        borderColor={isSelected ? 'blue.500' : 'gray.200'}
        onClick={handleClick}
        onDragStart={handleDragStart}
        _hover={{ shadow: 'md' }}
        draggable
      >
        <IAMNodeIcon nodeLabel='User' />
        <Box marginTop={1}>
          <Text fontWeight='700' align='center'>
            {label}
          </Text>
        </Box>
      </Flex>
    </Tooltip>
  );
};

export default IAMSidePanelNode;
