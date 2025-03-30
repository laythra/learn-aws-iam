import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverHeader,
  PopoverBody,
  Box,
  PopoverCloseButton,
  type PlacementWithLogical,
} from '@chakra-ui/react';
import Markdown from 'react-markdown';

import { PopoverNextButton } from './PopoverNextButton';
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
    <Popover
      isOpen={isOpen}
      placement={placement}
      isLazy={true}
      closeOnEsc={showCloseButton}
      closeDelay={100}
      closeOnBlur={showCloseButton}
    >
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
        {showNextButton && <PopoverNextButton onNextClick={onNextClick} />}
      </PopoverContent>
    </Popover>
  );
};
