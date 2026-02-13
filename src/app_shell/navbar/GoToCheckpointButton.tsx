import { useEffect } from 'react';

import {
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Tooltip,
  Box,
  PopoverFooter,
  Button,
  ButtonGroup,
  Text,
} from '@chakra-ui/react';
import { ArrowUturnLeftIcon } from '@heroicons/react/16/solid';
import isEqual from 'lodash/isEqual';

import { useNavbarPopover } from '@/app_shell/navbar/useNavbarPopover';
import { restartLevelFromCheckpoint } from '@/app_shell/runtime/level-operations';
import { useLevelActor, useLevelSelector } from '@/app_shell/runtime/level-runtime';

interface GoToCheckpointButtonProps {}

const HELP_POPOVER_TIMEOUT = 1000 * 60; // 1 minute

export const GoToCheckpointButton: React.FC<GoToCheckpointButtonProps> = () => {
  const levelState = useLevelSelector(state => state.value, isEqual);
  const levelActor = useLevelActor();

  const helpPopover = useNavbarPopover('checkpoint-help');
  const confirmPopover = useNavbarPopover('checkpoint-confirm');

  const handleButtonClick = (): void => {
    if (helpPopover.isOpen) {
      helpPopover.onClose();
    }
    confirmPopover.onOpen();
  };

  const returnToCheckpoint = (): void => {
    restartLevelFromCheckpoint();
    confirmPopover.onClose();
  };

  useEffect(() => {
    const timeoutID = setTimeout(() => {
      const isAnyPopoverOpen =
        levelActor.getSnapshot().context.show_popovers ||
        levelActor.getSnapshot().context.show_fixed_popovers;

      if (!confirmPopover.isOpen) {
        if (!isAnyPopoverOpen) {
          helpPopover.onOpen();
        }
      }
    }, HELP_POPOVER_TIMEOUT);

    return () => {
      clearTimeout(timeoutID);
      helpPopover.onClose();
    };
  }, [levelState, confirmPopover.isOpen, helpPopover, levelActor]);

  const isPopoverOpen = helpPopover.isOpen || confirmPopover.isOpen;

  return (
    <Tooltip label='Return to Checkpoint' isDisabled={isPopoverOpen}>
      <Box>
        <Popover
          placement='bottom-end'
          isOpen={isPopoverOpen}
          onClose={() => {
            // Only close help if help is visible
            if (helpPopover.isOpen) {
              helpPopover.onClose();
              return;
            }

            // Only close confirm if confirm is open
            if (confirmPopover.isOpen) {
              confirmPopover.onClose();
            }
          }}
        >
          <PopoverTrigger>
            <IconButton
              onClick={handleButtonClick}
              icon={<ArrowUturnLeftIcon />}
              aria-label='return-to-checkpoint-button'
              color='gray.600'
              _hover={{ color: 'black' }}
              _active={{ color: 'black' }}
              bg='transparent'
              size='xs'
            />
          </PopoverTrigger>
          <PopoverContent
            border='2px solid'
            borderColor='gray.200'
            borderRadius='md'
            shadow='xl'
            _focus={{
              boxShadow: 'none',
              outline: 'none',
              borderColor: 'gray.200',
            }}
            _focusVisible={{
              boxShadow: 'none',
              outline: 'none',
              borderColor: 'gray.200',
            }}
          >
            {helpPopover.isOpen && (
              <>
                <PopoverArrow />
                <PopoverCloseButton onClick={helpPopover.onClose} />
                <PopoverHeader fontWeight='semibold' fontSize='16px'>
                  Feeling stuck?
                </PopoverHeader>
                <PopoverBody>
                  Click the <strong>Return to Checkpoint</strong> button to go back to your last
                  checkpoint. This will reset your progress and restore previous helpful hints and
                  guidance.
                </PopoverBody>
              </>
            )}
            {confirmPopover.isOpen && (
              <>
                <PopoverHeader fontWeight='semibold' borderBottom='none' pb={2}>
                  Return to Checkpoint?
                </PopoverHeader>
                <PopoverBody pt={0}>
                  <Text fontSize='md' color='gray.600' mb={2}>
                    Are you sure you want to return to your last checkpoint?
                  </Text>
                  <Text fontSize='md' color='orange.600' fontWeight='medium'>
                    Progress since the checkpoint will be lost.
                  </Text>
                </PopoverBody>
                <PopoverFooter display='flex' justifyContent='flex-end' border='none'>
                  <ButtonGroup size='sm' spacing={3}>
                    <Button variant='outline' onClick={confirmPopover.onClose}>
                      Cancel
                    </Button>
                    <Button colorScheme='blue' onClick={returnToCheckpoint}>
                      Confirm
                    </Button>
                  </ButtonGroup>
                </PopoverFooter>
              </>
            )}
          </PopoverContent>
        </Popover>
      </Box>
    </Tooltip>
  );
};
