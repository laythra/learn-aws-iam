import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Image,
  Box,
} from '@chakra-ui/react';
import { useTheme } from '@chakra-ui/react';
import Markdown from 'react-markdown';

import { LevelsProgressionContext } from '@/components/providers/LevelsProgressionProvider';
import { CustomTheme } from '@/types';
import { remarkChakra } from '@/utils/markdown/chakra-markdown';
import { components } from '@/utils/markdown/components';

interface TutorialPopupProps {}

export const TutorialPopup: React.FC<TutorialPopupProps> = () => {
  const theme = useTheme<CustomTheme>();
  const levelActor = LevelsProgressionContext.useActorRef();
  const { showPopups, popupContent } = LevelsProgressionContext.useSelector(state => ({
    showPopups: state.context.show_popups,
    popupContent: state.context.popup_content,
  }));

  const handleNextPopup = (): void => {
    levelActor.send({ type: 'NEXT_POPUP' });
  };

  if (!popupContent) return null;

  return (
    <Modal isOpen={showPopups} onClose={() => {}} isCentered motionPreset='slideInBottom'>
      <ModalOverlay />
      <ModalContent maxW={theme.sizes.modalsMaxWidthInPixels}>
        <ModalHeader fontWeight='700' fontSize={24} pt={6}>
          {popupContent.title}
        </ModalHeader>
        <ModalBody overflow='auto'>
          <Markdown components={components} rehypePlugins={[remarkChakra]}>
            {popupContent.content}
          </Markdown>
          {popupContent.image && (
            <Box borderRadius={16} borderWidth='2px' borderColor='gray.200'>
              <Image src={popupContent.image} borderRadius={16} />
            </Box>
          )}
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' onClick={handleNextPopup}>
            Next
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
