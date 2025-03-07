import React, { useEffect, useRef } from 'react';

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
import { CodeEditorCreate } from './Create/CodeEditorCreate';
import { CreateSubmitButton } from './Create/CreateSubmitButton';
import { CodeEditorEdit } from './Edit/CodeEditorEdit';
import { EditSubmitButton } from './Edit/EditSubmitButton';
import codeEditorStateStore from '../stores/code-editor-state-store';
import { ElementID } from '@/config/element-ids';
import { useDisableInTutorial } from '@/hooks/useDisableInTutorial';
import CodeEditorPopupStore, { CodeEditorMode } from '@/stores/code-editor-popup-store';
import { CustomTheme, IAMNodeEntity } from '@/types';

interface CodeEditorProps {}

export const CodeEditor: React.FC<CodeEditorProps> = () => {
  const theme = useTheme<CustomTheme>();
  const { isElementEnabled } = useDisableInTutorial({
    elementIds: [ElementID.CodeEditorPolicyTab, ElementID.CodeEditorRoleTab],
  });

  const [isCodeEditorOpen, codeEditorMode, selectedNodeId] = useSelector(
    CodeEditorPopupStore,
    state => [state.context.isOpen, state.context.mode, state.context.selectedNodeId],
    _.isEqual
  );

  const [selectedIAMEntity, errors, warnings] = useSelector(
    codeEditorStateStore,
    state => [state.context.selectedIAMEntity, state.context.errors, state.context.warnings],
    _.isEqual
  );

  const newNodeId = useRef(new Date().getTime().toString());
  const nodeId = selectedNodeId ?? newNodeId.current;

  const closeCodeEditor = (): void => {
    CodeEditorPopupStore.send({ type: 'close' });
  };

  useEffect(() => {
    if (!isElementEnabled(ElementID.CodeEditorPolicyTab)) {
      codeEditorStateStore.send({ type: 'setSelectedIAMEntity', payload: IAMNodeEntity.Role });
    } else if (!isElementEnabled(ElementID.CodeEditorRoleTab)) {
      codeEditorStateStore.send({ type: 'setSelectedIAMEntity', payload: IAMNodeEntity.Policy });
    }
  }, [isElementEnabled]);

  console.log('The selected IAM Entity is: ' + selectedIAMEntity);

  return (
    <>
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
              nodeId={nodeId}
            />
          </ModalHeader>
          <ModalBody>
            <CodeEditorHelpPopup />
            <VStack align='stretch' spacing={4}>
              {codeEditorMode === CodeEditorMode.Create ? (
                // Send errors and warnings to the CodeEditorCreate component from here!
                <CodeEditorCreate nodeId={nodeId} selectedIAMEntity={selectedIAMEntity} />
              ) : (
                <CodeEditorEdit
                  nodeId={nodeId}
                  selectedIAMEntity={selectedIAMEntity}
                  errors={errors[selectedIAMEntity][nodeId]}
                  warnings={warnings[selectedIAMEntity][nodeId]}
                />
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
