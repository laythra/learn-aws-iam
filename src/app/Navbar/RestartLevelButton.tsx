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
  Text,
} from '@chakra-ui/react';
import { ArrowPathIcon } from '@heroicons/react/16/solid';

import { useNavbarPopover } from '@/app/Navbar/useNavbarPopover';
import { restartLevelFromStart } from '@/features/level_progress/level-operations';

interface RestartLevelButtonProps {}

export const RestartLevelButton: React.FC<RestartLevelButtonProps> = () => {
  const { isOpen, onOpen, onClose } = useNavbarPopover('restart-level');

  const restartLevel = (): void => {
    restartLevelFromStart();
    onClose();
  };

  return (
    <Popover isOpen={isOpen} onClose={onClose} placement='bottom-start'>
      <PopoverTrigger>
        <Box>
          <Tooltip label='Restart Level' isDisabled={isOpen}>
            <IconButton
              onClick={onOpen}
              icon={<ArrowPathIcon />}
              aria-label='restart-level-button'
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
    </Popover>
  );
};
