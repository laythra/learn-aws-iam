import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { useTheme } from '@chakra-ui/react';
import _ from 'lodash';
import Markdown from 'react-markdown';

import { GoToNextLevelButton } from './GoToNextLevelButton';
import { HelpVideo } from '@/components/HelpVideo';
import { rehypeChakraBadge } from '@/lib/markdown/chakra-markdown';
import { createMarkdownComponents } from '@/lib/markdown/Components';
import { rehypeIcon } from '@/lib/markdown/icons-markdown';
import { useLevelActor, useLevelSelector } from '@/runtime/level-runtime';
import { CustomTheme } from '@/types/custom-theme';
import { VoidEvent } from '@/types/state-machine-event-enums';

const popupMarkdownComponents = createMarkdownComponents({
  defaultFontSize: 'lg',
  defaultListFontSize: 'md',
});

export const TutorialPopup: React.FC = () => {
  const theme = useTheme<CustomTheme>();
  const levelActor = useLevelActor();
  const [showPopups, popupContent] = useLevelSelector(
    state => [state.context.show_popups, state.context.popup_content],
    _.isEqual
  );

  const handleNextPopup = (): void => {
    levelActor.send({ type: VoidEvent.NextPopup });
  };

  if (!popupContent) return null;

  return (
    <Modal isOpen={showPopups} onClose={() => {}} isCentered motionPreset='slideInBottom'>
      <ModalOverlay />
      <ModalContent maxW={theme.sizes.modalsMaxWidthInPixels}>
        <ModalHeader fontWeight='700' fontSize={24} pt={6} data-element-id='tutorial-popup-title'>
          {popupContent.title}
        </ModalHeader>
        <ModalBody overflow='auto'>
          <Markdown
            components={popupMarkdownComponents}
            rehypePlugins={[rehypeChakraBadge, rehypeIcon]}
          >
            {popupContent.content}
          </Markdown>
          {popupContent.tutorial_video && <HelpVideo videoName={popupContent.tutorial_video} />}
        </ModalBody>

        <ModalFooter>
          {popupContent.go_to_next_level_button ? (
            <GoToNextLevelButton />
          ) : (
            <Button onClick={handleNextPopup} colorScheme='blue'>
              Next
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
