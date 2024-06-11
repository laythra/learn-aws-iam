import {
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverHeader,
  PopoverBody,
  Button,
  ButtonGroup,
  Box,
} from '@chakra-ui/react';

interface TutorialPopoverProps {
  isOpen: boolean;
  children: React.ReactNode;
  label: string;
  description: string;
  showNextButton: boolean;
  onNextClick: () => void;
}

export const TutorialPopover: React.FC<TutorialPopoverProps> = ({
  isOpen,
  children,
  label,
  description,
  showNextButton,
  onNextClick,
}) => {
  return (
    <Popover isOpen={isOpen} placement='auto' closeOnBlur={true} isLazy={true} closeDelay={0}>
      <PopoverTrigger>
        <Box>{children}</Box>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverHeader>{label}</PopoverHeader>
        {description && (
          <PopoverBody>
            <Text>{description}</Text>
          </PopoverBody>
        )}
        {showNextButton && (
          <ButtonGroup alignContent='flex-end'>
            <Button onClick={onNextClick}>Next</Button>
          </ButtonGroup>
        )}
      </PopoverContent>
    </Popover>
  );
};
