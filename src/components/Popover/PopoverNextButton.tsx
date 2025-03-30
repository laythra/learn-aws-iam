import { Icon, Button, Flex } from '@chakra-ui/react';
import { ArrowRightIcon } from '@heroicons/react/16/solid';

interface PopoverNextButtonProps {
  onNextClick: () => void;
}

export const PopoverNextButton: React.FC<PopoverNextButtonProps> = ({ onNextClick }) => {
  return (
    <Flex justifyContent='flex-end' pt={3} pr={1} pb={1}>
      <Button
        rightIcon={<Icon as={ArrowRightIcon} verticalAlign='middle' />}
        variant='solid'
        onClick={onNextClick}
        colorScheme='blue'
      >
        Next
      </Button>
    </Flex>
  );
};
