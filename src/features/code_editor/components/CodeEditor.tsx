import React, { useRef, useEffect } from 'react';

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
import { useIsElementRestricted } from '@/hooks/useIsElementRestricted';
import CodeEditorPopupStore, { CodeEditorMode } from '@/stores/code-editor-popup-store';
import { CustomTheme, IAMCodeDefinedEntity, IAMNodeEntity } from '@/types';

interface CodeEditorProps {}

export const CodeEditor: React.FC<CodeEditorProps> = () => {
  const theme = useTheme<CustomTheme>();
  const [
    isPolicyTabRestricted,
    isRoleTabRestricted,
    isSCPTabRestricted,
    isResourcePolicyTabRestricted,
  ] = useIsElementRestricted([
    ElementID.CodeEditorPolicyTab,
    ElementID.CodeEditorRoleTab,
    ElementID.CodeEditorSCPTab,
    ElementID.CodeEditorResourcePolicyTab,
  ]);

  const [isCodeEditorOpen, codeEditorMode, selectedNodeId] = useSelector(
    CodeEditorPopupStore,
    state => [state.context.isOpen, state.context.mode, state.context.selectedNodeId],
    _.isEqual
  );

  const [selectedIAMEntity, errorsMap, warningsMap] = useSelector(
    codeEditorStateStore,
    state => [state.context.selectedIAMEntity, state.context.errors, state.context.warnings],
    _.isEqual
  );

  const newNodeId = useRef(new Date().getTime().toString());
  const nodeId = selectedNodeId ?? newNodeId.current;
  const errors = errorsMap[selectedIAMEntity][nodeId];
  const warnings = warningsMap[selectedIAMEntity][nodeId];

  const closeCodeEditor = (): void => {
    CodeEditorPopupStore.send({ type: 'close' });
  };

  useEffect(() => {
    const entityOrder = [
      { restricted: isPolicyTabRestricted, entity: IAMNodeEntity.Policy },
      { restricted: isRoleTabRestricted, entity: IAMNodeEntity.Role },
      { restricted: isSCPTabRestricted, entity: IAMNodeEntity.SCP },
      { restricted: isResourcePolicyTabRestricted, entity: IAMNodeEntity.ResourcePolicy },
    ];

    const availableEntity = entityOrder.find(item => !item.restricted);
    if (availableEntity) {
      codeEditorStateStore.send({
        type: 'setSelectedIAMEntity',
        payload: availableEntity.entity as IAMCodeDefinedEntity,
      });
    }
  }, [isCodeEditorOpen]);

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
              {React.createElement(
                codeEditorMode === CodeEditorMode.Create ? CodeEditorCreate : CodeEditorEdit,
                {
                  nodeId,
                  selectedIAMEntity,
                  errors,
                  warnings,
                }
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            {React.createElement(
              codeEditorMode === CodeEditorMode.Create ? CreateSubmitButton : EditSubmitButton,
              {
                nodeId,
                selectedIAMEntity,
              }
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
