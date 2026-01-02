import {
  Popover,
  PopoverContent,
  PopoverBody,
  Portal,
  PopoverHeader,
  PopoverCloseButton,
} from '@chakra-ui/react';
import _ from 'lodash';
import Markdown from 'react-markdown';

import { PopoverNextButton } from './PopoverNextButton';
import { HelpImage } from '../HelpComponents/HelpImage';
import { LevelsProgressionContext } from '../providers/level-actor-contexts';
import { rehypeChakraBadge } from '@/utils/markdown/chakra-markdown';
import { components as markdownComponents } from '@/utils/markdown/components';

interface FixedPopover {}

/***
 * A popover that is fixed to a position on the screen, used for tutorial messages that
 * are not attached to a specific element.
 * Controlled by current fixed popover state in the level state machine.
 */
export const FixedPopover: React.FC<FixedPopover> = () => {
  const machineActor = LevelsProgressionContext().useActorRef();
  const [showFixedPopovers, fixedPopoverContent] = LevelsProgressionContext().useSelector(
    state => [state.context.show_fixed_popovers, state.context.fixed_popover_content],
    _.isEqual
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
              <Markdown components={markdownComponents} rehypePlugins={[rehypeChakraBadge]}>
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
