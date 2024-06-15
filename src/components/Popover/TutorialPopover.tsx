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
  PopoverCloseButton,
} from '@chakra-ui/react';

interface TutorialPopoverProps {
  isOpen: boolean;
  children: React.ReactNode;
  label: string;
  description: string;
  showNextButton?: boolean;
  showCloseButton?: boolean;
  onNextClick: () => void;
}

export const TutorialPopover: React.FC<TutorialPopoverProps> = ({
  isOpen,
  children,
  label,
  description,
  showNextButton = false,
  showCloseButton = false,
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
        {showCloseButton && <PopoverCloseButton />}
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
