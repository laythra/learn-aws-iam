import { Box, IconButton } from '@chakra-ui/react';
import { Bars3Icon } from '@heroicons/react/16/solid';

import { useLevelActor } from '@/app_shell/runtime/levelRuntime';
import { TutorialPopover } from '@/app_shell/tutorial/TutorialPopover';
import AnimatedRedDot from '@/components/Animated/AnimatedRedDot';
import { ElementID } from '@/config/element-ids';
import { useStateMachineEvent } from '@/app_shell/runtime/useStateMachineEvent';
import { StatelessStateMachineEvent } from '@/types/state-machine-event-enums';

interface NavbarSidePanelToggleProps {
  isRedDotEnabled: boolean;
}

export const NavbarSidePanelToggle: React.FC<NavbarSidePanelToggleProps> = ({
  isRedDotEnabled,
}) => {
  const { emitEvent } = useStateMachineEvent();
  const levelActor = useLevelActor();
  const toggleSidePanel = (): void => {
    emitEvent(StatelessStateMachineEvent.SidePanelOpened);
    levelActor.send({ type: 'TOGGLE_SIDE_PANEL' });
  };

  return (
    <Box position='relative'>
      <TutorialPopover elementId={ElementID.RightSidePanelToggleButton}>
        <IconButton
          data-element-id={ElementID.RightSidePanelToggleButton}
          onClick={toggleSidePanel}
          icon={<Bars3Icon />}
          aria-label='side-panel-button'
          color='gray.600'
          _hover={{ color: 'black' }}
          _active={{ color: 'black' }}
          bg='transparent'
          size='xs'
        />
      </TutorialPopover>
      {isRedDotEnabled && <AnimatedRedDot offset={3} />}
    </Box>
  );
};
