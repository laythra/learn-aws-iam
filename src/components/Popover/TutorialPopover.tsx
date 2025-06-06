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
import { HelpImage } from '../HelpComponents/HelpImage';
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
  imagePath?: string;
  onNextClick: () => void;
  onCloseClick: () => void;
  elementId: string;
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
  imagePath,
  onNextClick,
  onCloseClick,
  elementId,
}) => {
  return (
    <Popover
      isOpen={isOpen}
      placement={placement}
      closeOnEsc={showCloseButton}
      closeOnBlur={showCloseButton}
    >
      <PopoverTrigger>
        <Box>{children}</Box>
      </PopoverTrigger>

      <PopoverContent
        data-element-id={`popover-${elementId}`}
        motionProps={{
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0, transition: { duration: 0 } },
          transition: { duration: 0 },
        }}
      >
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
            {imagePath && <HelpImage imagePath={imagePath} />}
          </PopoverBody>
        )}
        {showNextButton && <PopoverNextButton onNextClick={onNextClick} />}
      </PopoverContent>
    </Popover>
  );
};
