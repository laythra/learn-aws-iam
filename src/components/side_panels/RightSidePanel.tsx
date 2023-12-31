import { useContext } from 'react';

import { Text } from '@chakra-ui/react';
import { IAMNodeContext } from 'components/nodes/IAMNodeProvider';
import SidePanel from 'components/side_panels/SidePanel';

const LeftSidePanel: React.FC = () => {
  const { selectedNode } = useContext(IAMNodeContext);

  return (
    <SidePanel alignment='right'>
      <Text>{selectedNode.description}</Text>
    </SidePanel>
  );
};

export default LeftSidePanel;
