import { useEffect, useState } from 'react';

import {
  Button,
  CloseButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverContent,
  PopoverBody,
  Portal,
  Text,
  useTheme,
  HStack,
} from '@chakra-ui/react';
import Markdown from 'react-markdown';

import { useModal } from '@/hooks/useModal';
import { rehypeChakraBadge } from '@/lib/markdown/chakra-markdown';
import { customMarkdownComponents } from '@/lib/markdown/Components';
import { rehypeIcon } from '@/lib/markdown/icons-markdown';
import { CustomTheme } from '@/types/custom-theme';

const mobileWarningMessage = `
  For the best experience, use a desktop or laptop computer.|lg

  This app involves crafting and editing JSON documents,
  which can be tricky to work with on smaller screens.|lg
`;

const POPUP_MOBILE_WARNING_KEY = 'popup_mobile_warning_shown';

const isUserOnMobile = (): boolean => {
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const smallScreen = window.innerWidth <= 768;
  return isTouch && smallScreen;
};

export const MobileWarning: React.FC = () => {
  const { openModal, closeModal, isModalOpen } = useModal();
  const [isMobile, setIsMobile] = useState(isUserOnMobile);
  const [popupDismissed, setPopupDismissed] = useState(false);
  const [popoverDismissed, setPopoverDismissed] = useState(false);
  const theme = useTheme<CustomTheme>();

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

  const handleDismiss = (): void => {
    closeModal(POPUP_MOBILE_WARNING_KEY);
    setPopupDismissed(true);
  };

  if (popupDismissed) {
    const topPos = theme.sizes.navbarHeightInPixels + 10;
    return (
      <Portal>
        <Popover isOpen={!popoverDismissed}>
          <PopoverContent position='fixed' top={`${topPos}px`} w='auto'>
            <PopoverBody>
              <HStack gap={1}>
                <Text fontWeight='semibold' fontSize='14px' color={theme.colors.orange[600]}>
                  ⚠️ Best experienced on a larger screen
                </Text>
                <CloseButton size='sm' onClick={() => setPopoverDismissed(true)} />
              </HStack>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Portal>
    );
  }

  return (
    <Modal
      isOpen={isModalOpen[POPUP_MOBILE_WARNING_KEY]}
      isCentered
      onClose={handleDismiss}
      closeOnOverlayClick={false}
      closeOnEsc={false}
      size='lg'
    >
      <ModalOverlay backdropFilter='blur(12px)' />
      <ModalContent>
        <ModalHeader>Best experienced on desktop ⚠️</ModalHeader>
        <ModalBody pb={6}>
          <Markdown
            components={customMarkdownComponents}
            rehypePlugins={[rehypeChakraBadge, rehypeIcon]}
          >
            {mobileWarningMessage}
          </Markdown>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme='blue' onClick={handleDismiss}>
            Continue Anyway
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
