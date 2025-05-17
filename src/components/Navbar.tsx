import React from 'react';

import { Box, Button, Flex, HStack, IconButton, Input, Text } from '@chakra-ui/react';
import { useTheme } from '@chakra-ui/react';
import { Bars3Icon } from '@heroicons/react/16/solid';
import _ from 'lodash';

import AnimatedRedDot from './Animated/AnimatedRedDot';
import { LevelsProgressionContext } from './providers/LevelsProgressionProvider';
import { ElementID } from '@/config/element-ids';
import { NewEntityButtonWithPopover } from '@/features/iam_entities';
import { useAnimatedRedDot } from '@/hooks/useAnimatedRedDot';
import currentLevelDetailsStore from '@/stores/current-level-details-store';
import { CustomTheme } from '@/types';

interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = () => {
  const theme = useTheme<CustomTheme>();
  const levelActor = LevelsProgressionContext().useActorRef();
  const [value, levelNumber, levelTitle] = LevelsProgressionContext().useSelector(
    state => [state.value, state.context.level_number, state.context.level_title],
    _.isEqual
  );

  const { isRedDotEnabledForElement } = useAnimatedRedDot({
    elementIds: [ElementID.RightSidePanelToggleButton],
  });

  const [pseudoLevelNumber, setPseudoLevelNumber] = React.useState<number>(levelNumber);

  const toggleSidePanel = (): void => {
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
          {(import.meta.env.VITE_APP_ENV || 'development') === 'development' && ( // TODO: REMOVE THIS! Something hacky for dev purposes only.
            <HStack>
              <Text>{JSON.stringify(value)}</Text>
              <Input
                name='level_number'
                value={pseudoLevelNumber}
                type='number'
                onChange={e => setPseudoLevelNumber(Number(e.target.value))}
              />
              <Button
                onClick={() =>
                  currentLevelDetailsStore.send({
                    type: 'setLevelNumber',
                    levelNumber: pseudoLevelNumber,
                  })
                }
              >
                GO
              </Button>
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

          <NewEntityButtonWithPopover elementid={ElementID.NewEntityBtn} />
          <Box position='relative'>
            <IconButton
              onClick={toggleSidePanel}
              icon={<Bars3Icon />}
              aria-label='side-panel-button'
              color='gray.600'
              _hover={{ color: 'black' }}
              _active={{ color: 'black' }}
              bg='transparent'
              size='xs'
            />
            {isRedDotEnabledForElement(ElementID.RightSidePanelToggleButton) && (
              <AnimatedRedDot offset={3} />
            )}
          </Box>
        </HStack>
      </Flex>
    </Box>
  );
};
