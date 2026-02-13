import { useState } from 'react';

import {
  IconButton,
  Tooltip,
  Box,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  Button,
  ButtonGroup,
  Wrap,
} from '@chakra-ui/react';
import { ForwardIcon } from '@heroicons/react/16/solid';
import { useSelector } from '@xstate/store/react';
import isEqual from 'lodash/isEqual';

import { useNavbarPopover } from '@/app_shell/navbar/useNavbarPopover';
import { pickLevel } from '@/app_shell/runtime/level-operations';
import { LevelDetailsStore } from '@/app_shell/runtime/level-store';

interface LevelPickerButtonProps {}

export const LevelPickerButton: React.FC<LevelPickerButtonProps> = () => {
  const { isOpen, onOpen, onClose } = useNavbarPopover('level-picker');
  const [maxLevelReached, currentLevel] = useSelector(
    LevelDetailsStore,
    state => [state.context.maxLevelReached, state.context.levelNumber],
    isEqual
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
    <Popover isOpen={isOpen} onClose={closePopover} placement='bottom-start'>
      <PopoverTrigger>
        <Box>
          <Tooltip label='Pick Level' isDisabled={isOpen}>
            <IconButton
              onClick={onOpen}
              icon={<ForwardIcon />}
              aria-label='level-picker-button'
              color='gray.600'
              _hover={{ color: 'black' }}
              _active={{ color: 'black' }}
              bg='transparent'
              size='xs'
            />
          </Tooltip>
        </Box>
      </PopoverTrigger>
      <PopoverContent shadow='xl'>
        <PopoverHeader fontWeight='semibold' borderBottom='none' pb={2}>
          Select Level
        </PopoverHeader>
        <PopoverBody pt={0}>
          <Wrap spacing='4'>
            {Array.from({ length: 12 }, (__, i) => i + 1).map(lvl => (
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
          </Wrap>
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
    </Popover>
  );
};
