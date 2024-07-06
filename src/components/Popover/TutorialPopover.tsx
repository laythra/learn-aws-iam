import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverHeader,
  PopoverBody,
  Icon,
  Button,
  Box,
  PopoverCloseButton,
  type PlacementWithLogical,
  Portal,
  Text,
} from '@chakra-ui/react';
import { ArrowRightIcon } from '@heroicons/react/16/solid';

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
          <PopoverHeader fontWeight='semibold' borderBottomWidth={0}>
            {label}
          </PopoverHeader>
          {showCloseButton && <PopoverCloseButton onClick={onCloseClick} />}
          {description && (
            <PopoverBody>
              <Text>{description}</Text>
            </PopoverBody>
          )}
          {showNextButton && (
            <Box display='flex' justifyContent='flex-end' pt={3} pr={1} pb={1}>
              <Button
                rightIcon={<Icon as={ArrowRightIcon} verticalAlign='middle' />}
                variant='outline'
                colorScheme='blue'
                onAbort={onNextClick}
              >
                Next
              </Button>
            </Box>
          )}
        </PopoverContent>
      </Portal>
    </Popover>
  );
};
