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
import { HelpImage } from '../HelpComponents/HelpImage';
import { LevelsProgressionContext } from '@/components/providers/level-actor-contexts';
import { CustomTheme } from '@/types/custom-theme';
import { rehypeChakraBadge } from '@/utils/markdown/chakra-markdown';
import { components } from '@/utils/markdown/components';

interface TutorialPopupProps {}

export const TutorialPopup: React.FC<TutorialPopupProps> = () => {
  const theme = useTheme<CustomTheme>();
  const levelActor = LevelsProgressionContext().useActorRef();
  const [showPopups, popupContent] = LevelsProgressionContext().useSelector(
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
          <Markdown components={components} rehypePlugins={[rehypeChakraBadge]}>
            {popupContent.content}
          </Markdown>
          {popupContent.image && <HelpImage imagePath={popupContent.image} />}
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
