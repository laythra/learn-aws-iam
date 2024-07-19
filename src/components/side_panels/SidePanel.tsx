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
  const flexBasis = isOpen ? '20%' : '0%';

  return (
    <Flex
      h='100vh'
      direction={alignment === 'left' ? 'row' : 'row-reverse'}
      flexGrow={0}
      flexShrink={1}
      flexBasis={flexBasis}
    >
      <Collapse in style={{ overflow: 'hidden' }}>
        {isOpen && (
          <Box h='100%' overflowY='auto'>
            <Box m={4}>{children}</Box>
          </Box>
        )}
      </Collapse>
    </Flex>
  );
};

export default SidePanel;
