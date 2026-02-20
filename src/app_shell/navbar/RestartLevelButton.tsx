import {
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  Button,
  ButtonGroup,
  Text,
} from '@chakra-ui/react';
import { ArrowPathIcon } from '@heroicons/react/16/solid';

import { useNavbarPopover } from '@/app_shell/navbar/useNavbarPopover';
import { restartLevelFromStart } from '@/app_shell/runtime/level-operations';
import { NavbarPopoverButton } from '@/components/NavbarPopoverButton';

export const RestartLevelButton: React.FC = () => {
  const { isOpen, onOpen, onClose } = useNavbarPopover('restart-level');

  const restartLevel = (): void => {
    restartLevelFromStart();
    onClose();
  };

  return (
    <NavbarPopoverButton
      isOpen={isOpen}
      onClose={onClose}
      onClick={onOpen}
      tooltipLabel='Restart Level'
      icon={<ArrowPathIcon />}
      ariaLabel='restart-level-button'
    >
      <PopoverContent shadow='xl'>
        <PopoverHeader fontWeight='semibold' borderBottom='none' pb={2}>
          Restart Level?
        </PopoverHeader>
        <PopoverBody pt={0}>
          <Text fontSize='md' color='gray.600' mb={2}>
            Are you sure you want to restart this level?
          </Text>
          <Text fontSize='md' color='red.600' fontWeight='medium'>
            All progress for this level will be lost.
          </Text>
        </PopoverBody>
        <PopoverFooter display='flex' justifyContent='flex-end' border='none'>
          <ButtonGroup size='sm' spacing={3}>
            <Button variant='outline' onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme='blue' onClick={restartLevel}>
              Confirm
            </Button>
          </ButtonGroup>
        </PopoverFooter>
      </PopoverContent>
    </NavbarPopoverButton>
  );
};
