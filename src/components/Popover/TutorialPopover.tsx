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
  Text,
} from '@chakra-ui/react';
import { ArrowRightIcon } from '@heroicons/react/16/solid';
import Markdown from 'react-markdown';

import { remarkChakra } from '@/utils/markdown/chakra-markdown';
import { components as markdownComponents } from '@/utils/markdown/components';

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
}) => {
  return (
    <Popover isOpen={isOpen} placement={placement} closeOnBlur={true} isLazy={true}>
      <PopoverTrigger>
        <Box>{children}</Box>
      </PopoverTrigger>

      <PopoverContent>
        <PopoverArrow />
        <PopoverHeader
          fontWeight='semibold'
          borderBottomWidth={description ? 1 : 0}
          fontSize='16px'
        >
          {label}
        </PopoverHeader>
        {showCloseButton && <PopoverCloseButton onClick={onCloseClick} />}
        {description && (
          <PopoverBody>
            <Markdown components={markdownComponents} rehypePlugins={[remarkChakra]}>
              {description}
            </Markdown>
          </PopoverBody>
        )}
        {showNextButton && (
          <Box display='flex' justifyContent='flex-end' pt={3} pr={1} pb={1}>
            <Button
              rightIcon={<Icon as={ArrowRightIcon} verticalAlign='middle' />}
              variant='solid'
              onClick={onNextClick}
            >
              Next
            </Button>
          </Box>
        )}
      </PopoverContent>
    </Popover>
  );
};
