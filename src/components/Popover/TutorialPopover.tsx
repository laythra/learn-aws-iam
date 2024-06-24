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
  type PlacementWithLogical,
  Portal,
} from '@chakra-ui/react';

interface TutorialPopoverProps {
  isOpen: boolean;
  children: React.ReactNode;
  label: string;
  description: string;
  showNextButton?: boolean;
  showCloseButton?: boolean;
  placement?: PlacementWithLogical;
  onNextClick: () => void;
  onCloseClick: () => void;
  containerRef?: React.RefObject<HTMLElement>;
}

export const TutorialPopover: React.FC<TutorialPopoverProps> = ({
  isOpen,
  children,
  label,
  description,
  showNextButton = false,
  showCloseButton = false,
  placement = 'auto',
  onNextClick,
  onCloseClick,
  containerRef,
}) => {
  return (
    <Popover isOpen={isOpen} placement={placement} closeOnBlur={true} isLazy={true} closeDelay={0}>
      <PopoverTrigger>
        <Box>{children}</Box>
      </PopoverTrigger>

      <Portal containerRef={containerRef}>
        <PopoverContent>
          <PopoverArrow />
          <PopoverHeader>{label}</PopoverHeader>
          {showCloseButton && <PopoverCloseButton onClick={onCloseClick} />}
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
      </Portal>
    </Popover>
  );
};
