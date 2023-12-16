import { Position, Handle, NodeProps } from 'reactflow';
import { Flex, Text } from '@chakra-ui/react';
import { IAMNodeProps, IAMSidePanelNodeProps } from 'types';


/**
 * `IAMNode` renders a generic node to be used inside the side panel
 *
 * Props:
 * - `label`: The label to display in the node.
 * - `Icon`: The Ant Design icon to display in the node.
 */
const IAMSidePanelNode: React.FC<IAMSidePanelNodeProps> = ({ label, icon: Icon, iconName }) => {
  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData('text/plain', label);
    event.dataTransfer.setData('application/icon-name', iconName);
  }

  return (
    <Flex
      direction='column'
      justify='center'
      align='center'
      width='80px'
      height='80px'
      color="black"
      border='2px solid #CBD5E0'
      cursor='pointer'
      draggable
      onDragStart={handleDragStart}
    >
      <Text>{label}</Text>
      <Icon height={100} />
    </Flex>
  );
};

export default IAMSidePanelNode;
