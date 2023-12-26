import { useContext } from 'react';

import { Text } from '@chakra-ui/react';
import { NodeContext } from 'components/nodes/NodeProvider';
import SidePanel from 'components/side_panels/SidePanel';

const LeftSidePanel: React.FC = () => {
  const { selectedNode } = useContext(NodeContext);

  return (
    <SidePanel alignment='right'>
      <Text>{selectedNode.description}</Text>
    </SidePanel>
  );
};

export default LeftSidePanel;
