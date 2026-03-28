import { Button, Flex } from '@chakra-ui/react';
import { ArrowRightIcon } from '@heroicons/react/16/solid';

interface PopoverNextButtonProps {
  onNextClick: () => void;
}

export const PopoverNextButton: React.FC<PopoverNextButtonProps> = ({ onNextClick }) => {
  return (
    <Flex justifyContent='flex-end' pt={3} pr={1} pb={1}>
      <Button
        rightIcon={<ArrowRightIcon width={16} height={16} />}
        variant='solid'
        onClick={onNextClick}
      >
        Next
      </Button>
    </Flex>
  );
};
