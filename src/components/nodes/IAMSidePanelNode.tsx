import { useContext } from 'react';
import { Flex, Text } from '@chakra-ui/react';
import { IAMSidePanelNodeProps } from 'types';
import { NodeContext } from 'components/nodes/NodeProvider';

/**
 * `IAMNode` renders a generic node to be used inside the side panel
 *
 * Props:
 * - `label`: The label to display in the node.
 * - `Icon`: The Ant Design icon to display in the node.
 */
const IAMSidePanelNode: React.FC<IAMSidePanelNodeProps> = ({
  id,
  type,
  description,
  label,
  icon: Icon,
  iconName,
}) => {
  const { setSelectedNode } = useContext(NodeContext);

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData('text/plain', label);
    event.dataTransfer.setData('application/icon-name', iconName);
  };

  const handleClick = (_event: React.MouseEvent<HTMLDivElement>) => {
    setSelectedNode({ id, type, description });
  };

  return (
    <Flex
      direction='column'
      justify='center'
      align='center'
      width='80px'
      height='80px'
      border='2px solid #CBD5E0'
      cursor='pointer'
      draggable
      onDragStart={handleDragStart}
      onClick={handleClick}
      textAlign='center'
    >
      <Text>{label}</Text>
      <Icon height={100} />
    </Flex>
  );
};

export default IAMSidePanelNode;
