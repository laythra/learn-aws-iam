import React from 'react';

import { Box, Button, Flex, HStack, Input, Text, IconButton } from '@chakra-ui/react';
import { useTheme } from '@chakra-ui/react';
import { Bars3Icon } from '@heroicons/react/16/solid';
import _ from 'lodash';

import AnimatedRedDot from './Animated/AnimatedRedDot';
import { GoToCheckpointButton } from './GoToCheckpointButton';
import { TutorialPopover } from './Popover/TutorialPopover';
import { LevelsProgressionContext } from './providers/level-actor-contexts';
import { RestartLevelButton } from './RestartLevelButton';
import { ElementID } from '@/config/element-ids';
import { NewEntityButton } from '@/features/iam_entities';
import { useAnimatedRedDot } from '@/hooks/useAnimatedRedDot';
import { useStateMachineEvent } from '@/hooks/useStateMachineEvent';
import currentLevelDetailsStore from '@/stores/current-level-details-store';
import { CustomTheme } from '@/types/custom-theme';
import { StatelessStateMachineEvent } from '@/types/state-machine-event-enums';

interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = () => {
  const theme = useTheme<CustomTheme>();
  const levelActor = LevelsProgressionContext().useActorRef();
  const [value, levelNumber, levelTitle] = LevelsProgressionContext().useSelector(
    state => [state.value, state.context.level_number, state.context.level_title],
    _.isEqual
  );

  const { emitEvent } = useStateMachineEvent();

  const { isRedDotEnabledForElement } = useAnimatedRedDot({
    elementIds: [ElementID.RightSidePanelToggleButton],
  });

  const [pseudoLevelNumber, setPseudoLevelNumber] = React.useState<number>(levelNumber);

  const toggleSidePanel = (): void => {
    emitEvent(StatelessStateMachineEvent.SidePanelOpened);
    levelActor.send({ type: 'TOGGLE_SIDE_PANEL' });
  };

  return (
    <Box
      position='fixed'
      top='0'
      left='0'
      right='0'
      bg='white'
      height={theme.sizes.navbarHeightInPixels}
      p={4}
      boxShadow='md'
      zIndex={theme.zIndices.docked}
    >
      <Flex alignItems='center' justifyContent='space-between'>
        <Text fontSize='xl' fontWeight='bold' color='black' isTruncated>
          Learn AWS IAM
        </Text>
        <HStack spacing={4}>
          {(import.meta.env.VITE_APP_ENV || 'development') === 'development' && (
            <HStack>
              <Text>{JSON.stringify(value)}</Text>
              <Input
                name='level_number'
                value={pseudoLevelNumber}
                type='number'
                onChange={e => setPseudoLevelNumber(Number(e.target.value))}
              />
              <Button onClick={() => setLevel(pseudoLevelNumber)}>GO</Button>
            </HStack>
          )}
          <HStack spacing={2}>
            <Text fontSize='lg' fontWeight='bold' color='black'>
              Level {levelNumber}
            </Text>
            <Text fontSize='lg' fontWeight='semibold' color='gray.600'>
              | {levelTitle}
            </Text>
          </HStack>
          <Box position='relative'>
            <GoToCheckpointButton />
          </Box>
          <Box position='relative'>
            <RestartLevelButton />
          </Box>
          <NewEntityButton />
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
        </HStack>
      </Flex>
    </Box>
  );
};
