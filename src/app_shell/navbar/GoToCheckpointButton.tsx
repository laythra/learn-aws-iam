import { useEffect } from 'react';

import {
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverFooter,
  Button,
  ButtonGroup,
  Text,
} from '@chakra-ui/react';
import { ArrowUturnLeftIcon } from '@heroicons/react/16/solid';
import _ from 'lodash';

import { useNavbarPopover } from '@/app_shell/navbar/useNavbarPopover';
import { restartLevelFromCheckpoint } from '@/app_shell/runtime/level-operations';
import { useLevelActor, useLevelSelector } from '@/app_shell/runtime/level-runtime';
import { NavbarPopoverButton } from '@/components/NavbarPopoverButton';

const HELP_POPOVER_TIMEOUT = 1000 * 60 * 2; // 2 minutes

export const GoToCheckpointButton: React.FC = () => {
  const levelState = useLevelSelector(state => state.value, _.isEqual);
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
    if (helpPopover.isOpen) return;

    const timeoutID = setTimeout(() => {
      const isAnyPopoverOpen =
        levelActor.getSnapshot().context.show_popovers ||
        levelActor.getSnapshot().context.show_fixed_popovers;

      if (!confirmPopover.isOpen && !helpPopover.isOpen && !isAnyPopoverOpen) {
        helpPopover.onOpen();
      }
    }, HELP_POPOVER_TIMEOUT);

    return () => {
      clearTimeout(timeoutID);
    };
  }, [levelState, helpPopover.isOpen, confirmPopover.isOpen, helpPopover.isOpen, levelActor]);

  const isPopoverOpen = helpPopover.isOpen || confirmPopover.isOpen;

  return (
    <NavbarPopoverButton
      isOpen={isPopoverOpen}
      onClose={() => {
        if (helpPopover.isOpen) {
          helpPopover.onClose();
          return;
        }

        if (confirmPopover.isOpen) {
          confirmPopover.onClose();
        }
      }}
      onClick={handleButtonClick}
      placement='bottom-end'
      tooltipLabel='Return to Checkpoint'
      icon={<ArrowUturnLeftIcon />}
      ariaLabel='return-to-checkpoint-button'
    >
      <PopoverContent shadow='xl'>
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
    </NavbarPopoverButton>
  );
};
