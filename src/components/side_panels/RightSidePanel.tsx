import { useContext } from 'react';

import { Text } from '@chakra-ui/react';
import { NodeContext } from 'components/nodes/NodeProvider';
import SidePanel from 'components/side_panels/SidePanel';

export default function LeftSidePanel() {
  const { selectedNode } = useContext(NodeContext);

  return (
    <SidePanel alignment='right'>
      <Text>{selectedNode.description}</Text>
    </SidePanel>
  );
}
