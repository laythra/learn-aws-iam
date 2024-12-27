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
  Heading,
} from '@chakra-ui/react';
import { useSelector } from '@xstate/store/react';
import _ from 'lodash';

import { CodeEditorErrorsBox } from './CodeEditorErrorsBox';
import { CodeEditorHeader } from './CodeEditorHeader';
import { CodeEditorWarningsBox } from './CodeEditorWarningsBox';
import { CodeEditorCreate } from './Create/CodeEditorCreate';
import { CreateSubmitButton } from './Create/CreateSubmitButton';
import { CodeEditorEdit } from './Edit/CodeEditorEdit';
import { EditSubmitButton } from './Edit/EditSubmitButton';
import { RolePermissionsList } from './RolePermissionsList';
import codeEditorStateStore from '../stores/code-editor-state-store';
import CodeEditorPopupStore, { CodeEditorMode } from '@/stores/code-editor-popup-store';
import { CustomTheme, IAMNodeEntity } from '@/types';

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
    codeEditorStateStore.send({ type: 'deinitializeCodeEditor', nodeId });
  };

  return (
    <Modal isOpen={isCodeEditorOpen} onClose={closeCodeEditor} id='modal_content'>
      <ModalOverlay />
      <ModalContent
        maxW={theme.sizes.modalsMaxWidthInPixels}
        maxH={theme.sizes.codeEditorMaxHeightInPixels}
      >
        <ModalHeader>
          <CodeEditorHeader codeEditorMode={codeEditorMode} selectedIAMEntity={selectedIAMEntity} />
        </ModalHeader>
        <ModalBody>
          <VStack align='stretch' spacing={4}>
            <Heading size='md'>Code</Heading>
            {codeEditorMode === CodeEditorMode.Create ? (
              <CodeEditorCreate nodeId={nodeId} />
            ) : (
              <CodeEditorEdit nodeId={nodeId} />
            )}
            {selectedIAMEntity === IAMNodeEntity.Role && <RolePermissionsList />}
            <CodeEditorErrorsBox nodeId={nodeId} />
            {_.isEmpty(errors[nodeId]) && <CodeEditorWarningsBox nodeId={nodeId} />}
          </VStack>
        </ModalBody>
        <ModalFooter>
          {codeEditorMode === CodeEditorMode.Create ? (
            <CreateSubmitButton nodeId={nodeId} />
          ) : (
            <EditSubmitButton nodeId={nodeId} />
          )}
          <Button variant='ghost' onClick={closeCodeEditor}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
