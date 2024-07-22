import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
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

  return (
    <Modal isOpen={showPopups} onClose={() => {}} isCentered motionPreset='slideInBottom'>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{popupContent?.title}</ModalHeader>
        <ModalBody>{popupContent?.content}</ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' onClick={handleNextPopup}>
            Next
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
