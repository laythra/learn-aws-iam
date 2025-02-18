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
import { useSelector } from '@xstate/store/react';
import _ from 'lodash';

import { CodeEditorHeader } from './CodeEditorHeader';
import { CodeEditorHelpPopup } from './CodeEditorHelpPopup';
import { CodeEditorWarningsBox } from './CodeEditorWarningsBox';
import { CodeEditorCreate } from './Create/CodeEditorCreate';
import { CreateSubmitButton } from './Create/CreateSubmitButton';
import { CodeEditorEdit } from './Edit/CodeEditorEdit';
import { EditSubmitButton } from './Edit/EditSubmitButton';
import codeEditorStateStore from '../stores/code-editor-state-store';
import CodeEditorPopupStore, { CodeEditorMode } from '@/stores/code-editor-popup-store';
import { CustomTheme } from '@/types';

interface CodeEditorProps {}

export const CodeEditor: React.FC<CodeEditorProps> = () => {
  const theme = useTheme<CustomTheme>();

  const [isCodeEditorOpen, codeEditorMode, selectedNodeId] = useSelector(
    CodeEditorPopupStore,
    state => [state.context.isOpen, state.context.mode, state.context.selectedNodeId],
    _.isEqual
  );

  const { selectedIAMEntity, errors } = useSelector(
    codeEditorStateStore,
    state => _.pick(state.context, ['selectedIAMEntity', 'errors']),
    _.isEqual
  );

  const newNodeId = useRef(new Date().getTime().toString());
  const nodeId = selectedNodeId ?? newNodeId.current;

  const closeCodeEditor = (): void => {
    CodeEditorPopupStore.send({ type: 'close' });
  };

  return (
    <>
      <CodeEditorHelpPopup />
      <Modal isOpen={isCodeEditorOpen} onClose={closeCodeEditor} id='modal_content'>
        <ModalOverlay />
        <ModalContent
          maxW={theme.sizes.modalsMaxWidthInPixels}
          maxH={theme.sizes.codeEditorMaxHeightInPixels}
        >
          <ModalHeader>
            <CodeEditorHeader
              codeEditorMode={codeEditorMode}
              selectedIAMEntity={selectedIAMEntity}
            />
          </ModalHeader>
          <ModalBody>
            <VStack align='stretch' spacing={4}>
              {codeEditorMode === CodeEditorMode.Create ? (
                <CodeEditorCreate nodeId={nodeId} selectedIAMEntity={selectedIAMEntity} />
              ) : (
                <CodeEditorEdit nodeId={nodeId} selectedIAMEntity={selectedIAMEntity} />
              )}
              {/* <CodeEditorErrorsBox nodeId={nodeId} selectedIAMEntity={selectedIAMEntity} /> */}
              {_.isEmpty(errors[selectedIAMEntity][nodeId]) && (
                <CodeEditorWarningsBox nodeId={nodeId} selectedIAMEntity={selectedIAMEntity} />
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            {codeEditorMode === CodeEditorMode.Create ? (
              <CreateSubmitButton nodeId={nodeId} selectedIAMEntity={selectedIAMEntity} />
            ) : (
              <EditSubmitButton nodeId={nodeId} selectedIAMEntity={selectedIAMEntity} />
            )}
            <Button variant='ghost' onClick={closeCodeEditor}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
