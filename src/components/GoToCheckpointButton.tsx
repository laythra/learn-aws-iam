import { useEffect, useState } from 'react';

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
} from '@chakra-ui/react';
import { ArrowUturnLeftIcon } from '@heroicons/react/16/solid';
import _ from 'lodash';

import { LevelsProgressionContext } from './providers/level-actor-contexts';
import currentLevelDetailsStore from '@/stores/current-level-details-store';

interface GoToCheckpointButtonProps {}

const HELP_POPOVER_TIMEOUT = 1000 * 60; // 1 minute

export const GoToCheckpointButton: React.FC<GoToCheckpointButtonProps> = () => {
  const levelState = LevelsProgressionContext().useSelector(state => state.value, _.isEqual);
  const levelActor = LevelsProgressionContext().useActorRef();
  const [isPopoverVisible, setPopoverVisible] = useState<boolean>(false);

  const returnToCheckpoint = (): void => {
    currentLevelDetailsStore.send({ type: 'returnToLastCheckpoint' });
  };

  useEffect(() => {
    const timeoutID = setTimeout(() => {
      const isAnyPopoverOpen =
        levelActor.getSnapshot().context.show_popovers ||
        levelActor.getSnapshot().context.show_fixed_popovers;

      setPopoverVisible(!isAnyPopoverOpen);
    }, HELP_POPOVER_TIMEOUT);

    return () => {
      clearTimeout(timeoutID);
      setPopoverVisible(false);
    };
  }, [levelState]);

  return (
    <Tooltip label='Return to Checkpoint' isDisabled={isPopoverVisible}>
      <Box>
        <Popover placement='bottom-end' isOpen={isPopoverVisible}>
          <PopoverTrigger>
            <IconButton
              onClick={returnToCheckpoint}
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
            shadow='md'
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
            <PopoverArrow />
            <PopoverCloseButton onClick={() => setPopoverVisible(false)} />
            <PopoverHeader fontWeight='semibold' fontSize='16px'>
              Feeling stuck?
            </PopoverHeader>
            <PopoverBody>
              Click the <strong>Return to Checkpoint</strong> button to go back to your last
              checkpoint. This will reset your progress and restore previous helpful hints and
              guidance.
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Box>
    </Tooltip>
  );
};
