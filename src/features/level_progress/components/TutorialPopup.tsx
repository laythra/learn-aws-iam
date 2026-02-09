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
import { useLevelActor, useLevelSelector } from '@/app_shell/runtime/levelRuntime';
import { HelpImage } from '@/components/HelpImage';
import { rehypeChakraBadge } from '@/lib/markdown/chakra-markdown';
import { components as markdownComponents } from '@/lib/markdown/components';
import { rehypeIcon } from '@/lib/markdown/icons-markdown';
import { CustomTheme } from '@/types/custom-theme';

interface TutorialPopupProps {}

export const TutorialPopup: React.FC<TutorialPopupProps> = () => {
  const theme = useTheme<CustomTheme>();
  const levelActor = useLevelActor();
  const [showPopups, popupContent] = useLevelSelector(
    state => [state.context.show_popups, state.context.popup_content],
    _.isEqual
  );

  const handleNextPopup = (): void => {
    levelActor.send({ type: 'NEXT_POPUP' });
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
          <Markdown components={markdownComponents} rehypePlugins={[rehypeChakraBadge, rehypeIcon]}>
            {popupContent.content}
          </Markdown>
          {popupContent.tutorial_gif && <HelpImage gifName={popupContent.tutorial_gif} />}
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
