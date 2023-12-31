import { useContext } from 'react';

import { Flex, Box, Collapse } from '@chakra-ui/react';

import { SidePanelsContext } from './SidePanelsProvider';

interface SidePanelProps {
  children: React.ReactNode;
  alignment: 'left' | 'right';
}

const SidePanel: React.FC<SidePanelProps> = ({ children, alignment }) => {
  const { leftPanelOpen, rightPanelOpen } = useContext(SidePanelsContext);
  const isOpen = alignment === 'left' ? leftPanelOpen : rightPanelOpen;
  const panelWidth = isOpen ? '300px' : '0px';

  return (
    <Flex h='100vh' direction={alignment === 'left' ? 'row' : 'row-reverse'}>
      <Collapse in={true} style={{ width: panelWidth, overflow: 'hidden' }}>
        <Box p={4}>{children}</Box>
      </Collapse>
    </Flex>
  );
};

export default SidePanel;
