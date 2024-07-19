import { useContext } from 'react';

import { IconButton } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';

import { SidePanelsContext } from './SidePanelsProvider';

interface SidePanelToggleButtonProps {}

const SidePanelToggleButton: React.FC<SidePanelToggleButtonProps> = () => {
  const { rightPanelOpen, setRightPanelOpen } = useContext(SidePanelsContext);

  const icon = rightPanelOpen ? <ChevronRightIcon /> : <ChevronLeftIcon />;

  return (
    <IconButton
      aria-label='Toggle right panel'
      position='fixed'
      top='50%'
      right={rightPanelOpen ? '300px' : '0px'}
      transform='translateY(-50%)'
      colorScheme='gray'
      variant='ghost'
      onClick={setRightPanelOpen.toggle}
      size='sm'
      icon={icon}
    />
  );
};

export default SidePanelToggleButton;
