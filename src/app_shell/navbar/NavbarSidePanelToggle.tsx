import { Box, IconButton } from '@chakra-ui/react';
import { Bars3Icon } from '@heroicons/react/16/solid';

import { TutorialPopover } from '@/app_shell/tutorial/TutorialPopover';
import { useAnimatedRedDot } from '@/app_shell/ui/useAnimatedRedDot';
import AnimatedRedDot from '@/components/AnimatedRedDot';
import { ElementID } from '@/config/element-ids';
import { useLevelActor } from '@/runtime/level-runtime';
import { useStateMachineEvent } from '@/runtime/useStateMachineEvent';
import { StatelessStateMachineEvent } from '@/types/state-machine-event-enums';

export const NavbarSidePanelToggle: React.FC = () => {
  const { emitEvent } = useStateMachineEvent();
  const levelActor = useLevelActor();
  const { isRedDotEnabledForElement } = useAnimatedRedDot();

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
      {isRedDotEnabledForElement(ElementID.RightSidePanelToggleButton) && (
        <AnimatedRedDot offset={3} />
      )}
    </Box>
  );
};
