import React from 'react';

import {
  Modal,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
} from '@chakra-ui/react';
import { useTheme } from '@chakra-ui/react';
import { useSelector } from '@xstate/store/react';
import Markdown from 'react-markdown';

import { HELP_CONTENT } from '../config/help-content';
import { rehypeChakraBadge } from '@/lib/markdown/chakra-markdown';
import { customMarkdownComponents } from '@/lib/markdown/Components';
import { rehypeIcon } from '@/lib/markdown/icons-markdown';
import codeEditorStateStore from '@/stores/code-editor-state-store';
import { CustomTheme } from '@/types/custom-theme';

export const CodeEditorHelpPopup: React.FC = () => {
  const helpPopupInfo = useSelector(codeEditorStateStore, state => state.context.helpPopupInfo);
  const theme = useTheme<CustomTheme>();

  const closeHelpPopup = (): void => {
    codeEditorStateStore.send({ type: 'hideHelpPopup' });
  };

  const selectedEntity = helpPopupInfo.entity;
  const headerTitle = HELP_CONTENT[selectedEntity].title;
  const helpPopupContent = HELP_CONTENT[selectedEntity].markdown;

  return (
    <Modal
      isOpen={helpPopupInfo.isOpen}
      onClose={closeHelpPopup}
      isCentered
      motionPreset='slideInBottom'
    >
      <ModalOverlay />
      <ModalContent overflow='auto' maxW={theme.sizes.modalsMaxWidthInPixels + 150}>
        <ModalHeader>
          <Text>{headerTitle}</Text>
        </ModalHeader>

        <ModalBody maxH='600px' overflowY='auto'>
          <Markdown
            components={customMarkdownComponents}
            rehypePlugins={[rehypeChakraBadge, rehypeIcon]}
          >
            {helpPopupContent}
          </Markdown>
        </ModalBody>
        <ModalFooter>
          <Button onClick={closeHelpPopup}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
