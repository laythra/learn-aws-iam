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

import { HelpImage } from './HelpImage';
import { PopoverNextButton } from './PopoverNextButton';
import { usePopover } from './usePopover';
import { ElementID } from '@/config/element-ids';
import { rehypeChakraBadge } from '@/lib/markdown/chakra-markdown';
import { components as markdownComponents } from '@/lib/markdown/components';
import { rehypeIcon } from '@/lib/markdown/icons-markdown';

interface TutorialPopoverProps {
  children: React.ReactNode;
  elementId: string;
}

/**
 * A popover component that displays tutorial content for a specific UI element.
 *
 * This component wraps its children with a Chakra UI Popover that shows instructional
 * content including a title, description (with markdown support), optional image/GIF,
 * and navigation buttons. The popover's visibility and content are managed by the
 * `usePopover` hook based on the provided `elementId`.
 * @component
 * @param {TutorialPopoverProps} props - The component props
 * @param {React.ReactNode} props.children - The element that triggers the popover when rendered
 * @param {string} props.elementId - Unique identifier for the tutorial element, used to fetch and manage popover state
 * @example
 * ```tsx
 * <TutorialPopover elementId="welcome-button">
 *   <Button>Get Started</Button>
 * </TutorialPopover>
 * ```
 */
export const TutorialPopover: React.FC<TutorialPopoverProps> = ({ children, elementId }) => {
  const { isOpen, content, goNext, close } = usePopover(elementId);

  const {
    popover_title: label,
    popover_content: description,
    show_next_button: showNextButton,
    popover_placement: placement,
    show_close_button: showCloseButton,
    tutorial_gif: imagePath,
  } = content || {};

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
