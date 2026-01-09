import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverHeader,
  PopoverBody,
  Box,
  PopoverCloseButton,
} from '@chakra-ui/react';
import Markdown from 'react-markdown';

import { PopoverNextButton } from './PopoverNextButton';
import { HelpImage } from '../HelpComponents/HelpImage';
import { ElementID } from '@/config/element-ids';
import { usePopover } from '@/hooks/usePopover';
import { rehypeChakraBadge } from '@/utils/markdown/chakra-markdown';
import { components as markdownComponents } from '@/utils/markdown/components';
import { rehypeIcon } from '@/utils/markdown/icons-markdown';

interface TutorialPopoverProps {
  children: React.ReactNode;
  elementId: string;
}

export const TutorialPopover: React.FC<TutorialPopoverProps> = ({ children, elementId }) => {
  const { isOpen, content, goNext, close } = usePopover(elementId);

  // If not open or no content, just render children without popover wrapper
  if (!isOpen || !content) {
    return <>{children}</>;
  }

  const {
    popover_title: label,
    popover_content: description,
    show_next_button: showNextButton,
    popover_placement: placement,
    show_close_button: showCloseButton,
    tutorial_gif: imagePath,
  } = content;

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
        variants={{ exit: {}, enter: {} }}
        boxShadow='lg'
      >
        <PopoverArrow />
        <PopoverHeader
          fontWeight='semibold'
          borderBottomWidth={description ? 1 : 0}
          fontSize='16px'
        >
          {label}
        </PopoverHeader>
        {showCloseButton && (
          <PopoverCloseButton
            onClick={close}
            data-element-id={ElementID.TutorialPopoverCloseButton}
          />
        )}
        {description && (
          <PopoverBody>
            <Markdown
              components={markdownComponents}
              rehypePlugins={[rehypeChakraBadge, rehypeIcon]}
            >
              {description}
            </Markdown>
            {imagePath && <HelpImage gifName={imagePath} />}
          </PopoverBody>
        )}
        {showNextButton && <PopoverNextButton onNextClick={goNext} />}
      </PopoverContent>
    </Popover>
  );
};
