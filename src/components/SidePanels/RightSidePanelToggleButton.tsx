import { IconButton } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';

import { LevelsProgressionContext } from '../providers/LevelsProgressionProvider';

interface SidePanelToggleButtonProps {}

const SidePanelToggleButton: React.FC<SidePanelToggleButtonProps> = () => {
  const isOpen = LevelsProgressionContext().useSelector(state => state.context.side_panel_open);
  const levelActor = LevelsProgressionContext().useActorRef();

  const icon = isOpen ? <ChevronRightIcon /> : <ChevronLeftIcon />;

  const toggleSidePanel = (): void => {
    levelActor.send({ type: 'TOGGLE_SIDE_PANEL' });
  };

  return (
    <IconButton
      aria-label='Toggle right panel'
      position='fixed'
      top='50%'
      right={isOpen ? '300px' : '0px'}
      transform='translateY(-50%)'
      colorScheme='gray'
      variant='ghost'
      onClick={toggleSidePanel}
      size='sm'
      icon={icon}
    />
  );
};

export default SidePanelToggleButton;
