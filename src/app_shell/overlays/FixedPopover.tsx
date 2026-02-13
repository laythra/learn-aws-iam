import {
  Popover,
  PopoverContent,
  PopoverBody,
  Portal,
  PopoverHeader,
  PopoverCloseButton,
} from '@chakra-ui/react';
import isEqual from 'lodash/isEqual';
import Markdown from 'react-markdown';

import { useLevelActor, useLevelSelector } from '@/app_shell/runtime/level-runtime';
import { PopoverNextButton } from '@/app_shell/tutorial';
import { HelpImage } from '@/components/HelpImage';
import { ElementID } from '@/config/element-ids';
import { rehypeChakraBadge } from '@/lib/markdown/chakra-markdown';
import { customMarkdownComponents } from '@/lib/markdown/Components';
import { rehypeIcon } from '@/lib/markdown/icons-markdown';

interface FixedPopover {}

/***
 * A popover that is fixed to a position on the screen, used for tutorial messages that
 * are not attached to a specific element.
 * Controlled by current fixed popover state in the level state machine.
 */
export const FixedPopover: React.FC<FixedPopover> = () => {
  const machineActor = useLevelActor();
  const [showFixedPopovers, fixedPopoverContent] = useLevelSelector(
    state => [state.context.show_fixed_popovers, state.context.fixed_popover_content],
    isEqual
  );

  const showPopover = fixedPopoverContent && showFixedPopovers;

  if (!showPopover) {
    return null;
  }

  const popoverMessage = fixedPopoverContent!;
  const position = popoverMessage.position;
  const topPos = position.includes('top') ? '10px' : 'auto';
  const bottomPos = position.includes('bottom') ? '10px' : 'auto';
  const leftPos = position.includes('left') ? '10px' : 'auto';
  const rightPos = position.includes('right') ? '10px' : 'auto';

  const showNextFixedPopover = (): void => {
    machineActor.send({ type: 'NEXT_FIXED_POPOVER' });
  };

  const hideFixedPopovers = (): void => {
    machineActor.send({ type: 'HIDE_FIXED_POPOVERS' });
  };

  return (
    <Portal>
      <Popover isOpen={true}>
        <PopoverContent
          position='fixed'
          data-element-id={ElementID.FixedPopover}
          top={topPos}
          bottom={bottomPos}
          left={leftPos}
          right={rightPos}
          w='400px'
          boxShadow='lg'
        >
          <PopoverHeader
            fontWeight='semibold'
            borderBottomWidth={popoverMessage.popover_content ? 1 : 0}
            fontSize='16px'
          >
            {popoverMessage.popover_title}
          </PopoverHeader>
          {popoverMessage.show_close_button && <PopoverCloseButton onClick={hideFixedPopovers} />}
          {popoverMessage.popover_content && (
            <PopoverBody>
              <Markdown
                components={customMarkdownComponents}
                rehypePlugins={[rehypeChakraBadge, rehypeIcon]}
              >
                {popoverMessage.popover_content}
              </Markdown>
              {popoverMessage.tutorial_gif && <HelpImage gifName={popoverMessage.tutorial_gif} />}
            </PopoverBody>
          )}
          {popoverMessage.show_next_button && (
            <PopoverNextButton onNextClick={showNextFixedPopover} />
          )}
        </PopoverContent>
      </Popover>
    </Portal>
  );
};
