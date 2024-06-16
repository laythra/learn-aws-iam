import { useContext } from 'react';

import { useTheme } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

import { SidePanelsContext } from './SidePanelsProvider';

interface SidePanelToggleButtonProps {}

const SidePanelToggleButton: React.FC<SidePanelToggleButtonProps> = () => {
  const { leftPanelOpen, setLeftPanelOpen } = useContext(SidePanelsContext);
  const theme = useTheme();

  const icon = leftPanelOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />;

  return (
    <Button
      position='fixed'
      top='50%'
      left={leftPanelOpen ? '300px' : '0px'}
      transform='translateY(-50%)'
      colorScheme='gray'
      variant='ghost'
      onClick={setLeftPanelOpen.toggle}
      zIndex={theme.zIndices.toast}
    >
      {icon}
    </Button>
  );
};

export default SidePanelToggleButton;
