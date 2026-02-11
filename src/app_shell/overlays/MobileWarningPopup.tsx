import { useEffect, useState } from 'react';

import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody } from '@chakra-ui/react';
import Markdown from 'react-markdown';

import { useModal } from '@/hooks/useModal';
import { rehypeChakraBadge } from '@/lib/markdown/chakra-markdown';
import { customMarkdownComponents } from '@/lib/markdown/Components';
import { rehypeIcon } from '@/lib/markdown/icons-markdown';

const mobileWarningMessage = `
  This application isn't optimized for mobile devices.
  For the best experience, please use a desktop or laptop computer.|lg

  You'll be crafting and editing JSON documents,
  which can be tricky to work with on smaller screens.|lg
`;

const POPUP_MOBILE_WARNING_KEY = 'popup_mobile_warning_shown';

const isUserOnMobile = (): boolean => {
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const smallScreen = window.innerWidth <= 768;
  return isTouch && smallScreen;
};

export const MobileWarningPopup: React.FC = () => {
  const { openModal, closeModal, isModalOpen } = useModal();
  const [isMobile, setIsMobile] = useState(isUserOnMobile);

  useEffect(() => {
    const checkMobile = (): void => {
      const mobile = isUserOnMobile();
      setIsMobile(mobile);

      if (mobile) {
        openModal(POPUP_MOBILE_WARNING_KEY);
      } else {
        closeModal(POPUP_MOBILE_WARNING_KEY);
      }
    };

    checkMobile();

    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isMobile) {
    return null;
  }

  return (
    <Modal
      isOpen={isModalOpen[POPUP_MOBILE_WARNING_KEY]}
      isCentered
      onClose={() => closeModal(POPUP_MOBILE_WARNING_KEY)}
      size='lg'
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>You lack the mobile-friendly permission ⛔</ModalHeader>
        <ModalBody pb={6}>
          <Markdown
            components={customMarkdownComponents}
            rehypePlugins={[rehypeChakraBadge, rehypeIcon]}
          >
            {mobileWarningMessage}
          </Markdown>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
