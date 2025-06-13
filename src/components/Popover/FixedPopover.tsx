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
import { LevelsProgressionContext } from '../providers/LevelsProgressionProvider';
import { remarkChakra } from '@/utils/markdown/chakra-markdown';
import { components as markdownComponents } from '@/utils/markdown/components';

interface FixedPopover {}

export const FixedPopover: React.FC<FixedPopover> = () => {
  const machineActor = LevelsProgressionContext().useActorRef();
  const [fixedPopoverIndex, showFixedPopovers, fixedPopoverContent] =
    LevelsProgressionContext().useSelector(
      state => [
        state.context.next_fixed_popover_index,
        state.context.show_fixed_popovers,
        state.context.fixed_popover_content,
      ],
      _.isEqual
    );

  const fixedPopoverMessages = machineActor.getSnapshot().context.fixed_popover_messages;
  const showPopover =
    (fixedPopoverIndex < fixedPopoverMessages.length || fixedPopoverContent) && showFixedPopovers;

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
              <Markdown components={markdownComponents} rehypePlugins={[remarkChakra]}>
                {popoverMessage.popover_content}
              </Markdown>
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
