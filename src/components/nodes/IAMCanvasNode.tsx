import { Flex, Text } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { Position, Handle, NodeProps } from 'reactflow';
import { IAMNodeProps } from 'types';

const NodeWrapper = styled(Flex)`
  direction: column;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  border: 2px solid #cbd5e0;
`;

/**
 * `IAMNode` renders a generic square node with a label and an icon.
 * It uses Chakra UI for styling and Ant Design icons for the icon.
 *
 * Props:
 * - `label`: The label to display in the node.
 * - `Icon`: The Ant Design icon to display in the node.
 */
const IAMCanvasNode: React.FC<NodeProps> = ({ data }) => {
  const { label, icon: Icon } = data as IAMNodeProps;

  return (
    <NodeWrapper>
      <Handle type='target' position={Position.Top} />
      <Text>{label}</Text>
      <Icon height={100} />
      <Handle type='source' position={Position.Bottom} />
    </NodeWrapper>
  );
};

export default IAMCanvasNode;
