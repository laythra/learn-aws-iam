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
} from '@chakra-ui/react';
import { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { useSelector } from '@xstate/store/react';
import _ from 'lodash';

import { CodeEditorErrorsBox } from './CodeEditorErrorsBox';
import { CodeEditorHeader } from './CodeEditorHeader';
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

  const codeEditorRef = useRef<ReactCodeMirrorRef>(null);
  const newNodeId = useRef(new Date().getTime().toString());
  const nodeId = selectedNodeId ?? newNodeId.current;

  const closeCodeEditor = (): void => {
    CodeEditorPopupStore.send({ type: 'close' });
  };

  return (
    <Modal isOpen={isCodeEditorOpen} onClose={closeCodeEditor} id='modal_content'>
      <ModalOverlay />
      <ModalContent maxW={theme.sizes.modalsMaxWidthInPixels}>
        <ModalHeader>
          <CodeEditorHeader codeEditorMode={codeEditorMode} selectedIAMEntity={selectedIAMEntity} />
        </ModalHeader>
        <ModalBody>
          {codeEditorMode === CodeEditorMode.Create ? (
            <CodeEditorCreate ref={codeEditorRef} nodeId={nodeId} />
          ) : (
            <CodeEditorEdit ref={codeEditorRef} nodeId={nodeId} />
          )}
          <CodeEditorErrorsBox nodeId={nodeId} />
          {_.isEmpty(errors[nodeId]) && <CodeEditorWarningsBox nodeId={nodeId} />}
        </ModalBody>
        <ModalFooter>
          {codeEditorMode === CodeEditorMode.Create ? (
            <CreateSubmitButton nodeId={nodeId} editorView={codeEditorRef.current?.view} />
          ) : (
            <EditSubmitButton nodeId={nodeId} editorView={codeEditorRef.current?.view} />
          )}
          <Button variant='ghost' onClick={closeCodeEditor}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
