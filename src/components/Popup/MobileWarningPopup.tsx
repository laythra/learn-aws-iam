import { useEffect, useState } from 'react';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from '@chakra-ui/react';
import Markdown from 'react-markdown';

import { rehypeChakraBadge } from '@/utils/markdown/chakra-markdown';
import { components as markdownComponents } from '@/utils/markdown/components';

const mobileWarningMessage = `
  This application isn’t optimized for mobile devices.
  For the best experience, please use a desktop or laptop computer.|lg

  You'll be crafting and editing JSON documents,
  which can be tricky to work with on smaller screens.|lg
`;

interface MobileWarningProps {}

export const MobileWarningPopup: React.FC<MobileWarningProps> = () => {
  const [isMobile, setIsMobile] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const checkIsMobile = (): boolean => {
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const smallScreen = window.innerWidth <= 768;
      return isTouch && smallScreen;
    };

    const shouldShow = checkIsMobile();
    setIsMobile(shouldShow);
    if (shouldShow) onOpen();
  }, [onOpen]);

  if (!isMobile) return null;

  return (
    <Modal isOpen={isOpen} isCentered onClose={onClose} size='lg'>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>You lack the mobile-friendly permission ⛔</ModalHeader>
        <ModalBody pb={6}>
          <Markdown components={markdownComponents} rehypePlugins={[rehypeChakraBadge]}>
            {mobileWarningMessage}
          </Markdown>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
