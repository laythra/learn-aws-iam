import {
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Box,
  ButtonGroup,
  Button,
} from '@chakra-ui/react';
import { useTheme } from '@chakra-ui/react';

interface TutorialPopoverProps {
  isOpen: boolean;
  children: React.ReactNode;
  label: string;
  description: string;
  onNextClick: () => void;
}

export const TutorialPopover: React.FC<TutorialPopoverProps> = ({
  isOpen,
  children,
  label,
  description,
  onNextClick,
}) => {
  const theme = useTheme();

  return (
    <>
      <Popover isOpen={isOpen} placement='auto' closeOnBlur={false} isLazy={true}>
        <PopoverTrigger>
          <Box>{children}</Box>
        </PopoverTrigger>
        <PopoverContent zIndex={theme.zIndices.popover}>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>{label}</PopoverHeader>
          <PopoverBody>
            <Text>{description}</Text>
          </PopoverBody>

          <ButtonGroup alignContent='flex-end'>
            <Button onClick={onNextClick}>Next</Button>
          </ButtonGroup>
        </PopoverContent>
      </Popover>
    </>
  );
};
