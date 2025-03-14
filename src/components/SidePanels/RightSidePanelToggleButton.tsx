import { Box, IconButton } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';

import AnimatedRedDot from '../Animated/AnimatedRedDot';
import { LevelsProgressionContext } from '../providers/LevelsProgressionProvider';
import { ElementID } from '@/config/element-ids';
import { useAnimatedRedDot } from '@/hooks/useAnimatedRedDot';

interface SidePanelToggleButtonProps {}

const SidePanelToggleButton: React.FC<SidePanelToggleButtonProps> = () => {
  const isOpen = LevelsProgressionContext().useSelector(state => state.context.side_panel_open);
  const levelActor = LevelsProgressionContext().useActorRef();

  const icon = isOpen ? <ChevronRightIcon /> : <ChevronLeftIcon />;

  const toggleSidePanel = (): void => {
    levelActor.send({ type: 'TOGGLE_SIDE_PANEL' });
  };

  const { isRedDotEnabledForElement } = useAnimatedRedDot({
    elementIds: [ElementID.RightSidePanelToggleButton],
  });

  return (
    <Box position='fixed' top='50%' right={isOpen ? '300px' : '0px'} transform='translateY(-50%)'>
      <Box position='relative' display='inline-block'>
        <IconButton
          aria-label='Toggle right panel'
          colorScheme='gray'
          variant='ghost'
          onClick={toggleSidePanel}
          size='sm'
          icon={icon}
        />
        {isRedDotEnabledForElement(ElementID.RightSidePanelToggleButton) && <AnimatedRedDot />}
      </Box>
    </Box>
  );
};

export default SidePanelToggleButton;
