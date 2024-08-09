import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Image,
  Box,
} from '@chakra-ui/react';

import { LevelsProgressionContext } from '@/components/providers/LevelsProgressionProvider';

interface TutorialPopupProps {}

export const TutorialPopup: React.FC<TutorialPopupProps> = () => {
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
      <ModalContent maxW='530px'>
        <ModalHeader fontWeight='700' fontSize={24} pt={6}>
          {popupContent.title}
        </ModalHeader>
        <ModalBody>
          <Text pb={10} fontSize={18} color='grey.200'>
            {popupContent.content}
          </Text>
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
