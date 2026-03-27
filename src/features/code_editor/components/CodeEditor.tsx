import React, { useRef } from 'react';

import {
  Modal,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useTheme,
  VStack,
} from '@chakra-ui/react';
import { useSelector } from '@xstate/store-react';
import _ from 'lodash';

import { CodeEditorErrorFallback } from './CodeEditorErrorFallback';
import { CodeEditorHeader } from './CodeEditorHeader';
import { CodeEditorHelpPopup } from './CodeEditorHelpPopup';
import { CodeEditorCreate } from './create/CodeEditorCreate';
import { CreateSubmitButton } from './create/CreateSubmitButton';
import { CodeEditorEdit } from './edit/CodeEditorEdit';
import { EditSubmitButton } from './edit/EditSubmitButton';
import { ErrorBoundary } from '@/app/ErrorBoundary';
import { ElementID } from '@/config/element-ids';
import codeEditorStateStore from '@/stores/code-editor-state-store';
import { CustomTheme } from '@/types/custom-theme';

export const CodeEditor: React.FC = () => {
  const theme = useTheme<CustomTheme>();
  const [
    selectedIAMEntity,
    errorsMap,
    warningsMap,
    isCodeEditorOpen,
    codeEditorMode,
    selectedNodeId,
  ] = useSelector(
    codeEditorStateStore,
    state => [
      state.context.selectedIAMEntity,
      state.context.errors,
      state.context.warnings,
      state.context.isOpen,
      state.context.mode,
      state.context.selectedNodeId,
    ],
    _.isEqual
  );

  // Nodes have a pseudo ID before being created. refs are used to persist them across re-renders.
  const newNodeId = useRef(new Date().getTime().toString());
  // Encoding both selectedNodeId and selectedIAMEntity into the nodeId to ensure uniqueness across different entity types.
  const nodeId = selectedNodeId ?? `${newNodeId.current}-${selectedIAMEntity}`;
  const errors = errorsMap[nodeId];
  const warnings = warningsMap[nodeId];

  const closeCodeEditor = (): void => {
    codeEditorStateStore.send({ type: 'close' });
  };

  return (
    <>
      <Modal
        isOpen={isCodeEditorOpen}
        onClose={closeCodeEditor}
        id='modal_content'
        returnFocusOnClose={false}
      >
        <ModalOverlay />
        <ErrorBoundary fallback={<CodeEditorErrorFallback />}>
          <ModalContent
            maxW={theme.sizes.modalsMaxWidthInPixels + 300}
            maxH={theme.sizes.codeEditorMaxHeightInPixels}
            data-element-id={ElementID.CodeEditorPopup}
          >
            <ModalHeader>
              <CodeEditorHeader
                codeEditorMode={codeEditorMode}
                selectedIAMEntity={selectedIAMEntity}
                nodeId={nodeId}
              />
            </ModalHeader>
            <ModalBody>
              <CodeEditorHelpPopup />
              <VStack align='stretch' spacing={4}>
                {React.createElement(
                  codeEditorMode == 'create' ? CodeEditorCreate : CodeEditorEdit,
                  { nodeId, selectedIAMEntity, errors, warnings }
                )}
              </VStack>
            </ModalBody>
            <ModalFooter>
              {React.createElement(
                codeEditorMode === 'create' ? CreateSubmitButton : EditSubmitButton,
                { nodeId, selectedIAMEntity }
              )}
              <Button variant='ghost' onClick={closeCodeEditor}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </ErrorBoundary>
      </Modal>
    </>
  );
};
