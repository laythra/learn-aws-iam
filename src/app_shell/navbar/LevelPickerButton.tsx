import { useState } from 'react';

import {
  Tooltip,
  Box,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  Button,
  ButtonGroup,
  Grid,
} from '@chakra-ui/react';
import { ForwardIcon } from '@heroicons/react/16/solid';
import { useSelector } from '@xstate/store-react';
import _ from 'lodash';

import { useNavbarPopover } from '@/app_shell/navbar/useNavbarPopover';
import { NavbarPopoverButton } from '@/components/NavbarPopoverButton';
import { TOTAL_LEVELS } from '@/config/consts';
import { pickLevel } from '@/runtime/level-operations';
import { LevelDetailsStore } from '@/runtime/level-store';

export const LevelPickerButton: React.FC = () => {
  const { isOpen, onOpen, onClose } = useNavbarPopover('level-picker');
  const [maxLevelReached, currentLevel] = useSelector(
    LevelDetailsStore,
    state => [state.context.maxLevelReached, state.context.levelNumber],
    _.isEqual
  );

  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  const goToLevel = (): void => {
    if (selectedLevel !== null) {
      pickLevel(selectedLevel);
    }
  };

  const closePopover = (): void => {
    setSelectedLevel(null);
    onClose();
  };

  return (
    <NavbarPopoverButton
      isOpen={isOpen}
      onClose={closePopover}
      onClick={onOpen}
      tooltipLabel='Pick Level'
      icon={<ForwardIcon />}
      ariaLabel='level-picker-button'
    >
      <PopoverContent shadow='xl'>
        <PopoverHeader fontWeight='semibold' borderBottom='none' pb={2}>
          Select Level
        </PopoverHeader>
        <PopoverBody pt={0}>
          <Grid templateColumns='repeat(3, 1fr)' gap={2}>
            {Array.from({ length: TOTAL_LEVELS }, (__, i) => i + 1).map(lvl => (
              <Tooltip
                key={lvl}
                label={
                  lvl > maxLevelReached
                    ? 'Level not yet unlocked'
                    : lvl === currentLevel
                      ? 'Current level'
                      : `Go to Level ${lvl}`
                }
              >
                <Button
                  size='sm'
                  variant={selectedLevel === lvl ? 'solid' : 'outline'}
                  colorScheme={selectedLevel === lvl ? 'blue' : 'gray'}
                  isDisabled={lvl > maxLevelReached || lvl === currentLevel}
                  onClick={() => setSelectedLevel(lvl)}
                  px={3}
                  py={1}
                  borderRadius='lg'
                  fontWeight='medium'
                  borderWidth='2px'
                  bg={selectedLevel === lvl ? undefined : 'gray.50'}
                  _hover={{
                    bg: selectedLevel === lvl ? undefined : 'gray.100',
                    borderColor: 'gray.400',
                  }}
                >
                  {`Level ${lvl}`}
                </Button>
              </Tooltip>
            ))}
          </Grid>
        </PopoverBody>
        <PopoverFooter border='none'>
          <Box color='red.500' fontSize='sm' mb={3}>
            You&apos;ll lose your current progress when changing levels.
          </Box>
          <Box display='flex' justifyContent='flex-end'>
            <ButtonGroup size='sm' spacing={3}>
              <Button variant='outline' onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme='blue' onClick={goToLevel} isDisabled={selectedLevel === null}>
                Confirm
              </Button>
            </ButtonGroup>
          </Box>
        </PopoverFooter>
      </PopoverContent>
    </NavbarPopoverButton>
  );
};
