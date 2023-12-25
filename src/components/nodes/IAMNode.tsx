import { Position, Handle, NodeProps } from 'reactflow';
import { Flex, Text } from '@chakra-ui/react';
import { IAMNodeProps } from 'types';

/**
 * `IAMNode` renders a generic square node with a label and an icon.
 * It uses Chakra UI for styling and Ant Design icons for the icon.
 *
 * Props:
 * - `label`: The label to display in the node.
 * - `Icon`: The Ant Design icon to display in the node.
 */
export default function IAMNode({ data }: NodeProps) {
  const { label, icon: Icon } = data as IAMNodeProps;

  return (
    <Flex
      direction='column'
      justify='center'
      align='center'
      width='80px'
      height='80px'
      border='2px solid #CBD5E0'
    >
      <Handle type='target' position={Position.Top} />
      <Text>{label}</Text>
      <Icon height={100} />
      <Handle type='source' position={Position.Bottom} />
    </Flex>
  );
}
