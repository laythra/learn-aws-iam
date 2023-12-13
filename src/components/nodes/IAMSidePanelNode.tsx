import { Position, Handle, NodeProps } from 'reactflow';
import { Flex, Text } from '@chakra-ui/react';
import { IAMNodeProps } from 'types';


/**
 * `IAMNode` renders a generic node to be used inside the side panel
 *
 * Props:
 * - `label`: The label to display in the node.
 * - `Icon`: The Ant Design icon to display in the node.
 */
const IAMSidePanelNode: React.FC<IAMNodeProps> = ({ label, icon: Icon }) => {
  return (
    <Flex
      direction='column'
      justify='center'
      align='center'
      width='80px'
      height='80px'
      backgroundColor='#CBD5E0'
    >
      <Text>{label}</Text>
      <Icon height={100} />
    </Flex>
  );
};

export default IAMSidePanelNode;
