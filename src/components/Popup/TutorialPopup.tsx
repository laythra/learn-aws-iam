import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Box,
} from '@chakra-ui/react';
import { useTheme } from '@chakra-ui/react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import _ from 'lodash';
import Markdown from 'react-markdown';

import { GoToNextLevelButton } from './GoToNextLevelButton';
import { HelpImage } from '../HelpComponents/HelpImage';
import { LevelsProgressionContext } from '@/components/providers/LevelsProgressionProvider';
import { CustomTheme } from '@/types';
import { remarkChakra } from '@/utils/markdown/chakra-markdown';
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
      <ModalContent
        maxW={theme.sizes.modalsMaxWidthInPixels}
        data-element-id={popupContent.id || 'default-popup-id'} // TODO: Remove fallback ID when all popups have IDs
      >
        <ModalHeader fontWeight='700' fontSize={24} pt={6}>
          {popupContent.title}
        </ModalHeader>
        <ModalBody overflow='auto'>
          <Markdown components={components} rehypePlugins={[remarkChakra]}>
            {popupContent.content}
          </Markdown>
          {popupContent.image && <HelpImage imagePath={popupContent.image} />}
          {popupContent.lottie_animation && (
            <Box height='250px' width='250px' position='absolute' right='0' bottom='0'>
              <DotLottieReact
                src={`lottie/${popupContent.lottie_animation}.lottie`}
                loop={false}
                autoplay
              />
            </Box>
          )}
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
