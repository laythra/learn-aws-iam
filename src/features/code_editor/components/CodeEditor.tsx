import React, { useRef, useReducer } from 'react';
import { useState } from 'react';

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
import { Diagnostic } from '@codemirror/lint';
import { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { useSelector } from '@xstate/store/react';
import { produce } from 'immer';
import _ from 'lodash';

import { CodeEditorErrorsBox } from './CodeEditorErrorsBox';
import { CodeEditorHeader } from './CodeEditorHeader';
import { CodeEditorWarningsBox } from './CodeEditorWarningsBox';
import { CodeEditorWindow } from './CodeEditorWindow';
import { LevelsProgressionContext } from '@/components/providers/LevelsProgressionProvider';
import { MANAGED_POLICIES } from '@/machines/config';
import CodeEditorPopupStore, { CodeEditorMode } from '@/stores/code-editor-popup-store';
import { IAMScriptableEntity, IAMNodeEntity, CustomTheme, IAMAnyNodeData } from '@/types';

type Action =
  | { type: 'SET_ERRORS'; entity: IAMScriptableEntity; payload: Diagnostic[] }
  | { type: 'SET_WARNINGS'; entity: IAMScriptableEntity; payload: string[] }
  | { type: 'SET_CONTENT'; entity: IAMScriptableEntity; payload: string }
  | { type: 'SET_SELECTED_IAM_ENTITY'; payload: IAMScriptableEntity };

interface CodeEditorState {
  errors: Record<IAMScriptableEntity, Diagnostic[]>;
  warnings: Record<IAMScriptableEntity, string[]>;
  content: Record<IAMScriptableEntity, string>;
  selectedIAMEntity: IAMScriptableEntity;
}

interface CodeEditorProps {}

export const CodeEditor: React.FC<CodeEditorProps> = () => {
  const theme = useTheme<CustomTheme>();

  const [isLinting, setIsLinting] = useState<boolean>(false);
  const levelActor = LevelsProgressionContext.useActorRef();
  const policyRoleObjectives = LevelsProgressionContext.useSelector(
    state => state.context.policy_role_objectives,
    _.isEqual
  );

  const [isCodeEditorOpen, codeEditorMode, selectedNodeId] = useSelector(
    CodeEditorPopupStore,
    state => [state.context.isOpen, state.context.mode, state.context.selectedNodeId],
    _.isEqual
  );

  const codeEditorRef = useRef<ReactCodeMirrorRef>(null);

  const codeEditorReducer = (state: CodeEditorState, action: Action): CodeEditorState => {
    switch (action.type) {
      case 'SET_ERRORS':
        // We're not using immer here because the Diagnostic type has readonly properties
        return {
          ...state,
          errors: {
            ...state.errors,
            [action.entity]: action.payload,
          },
        };
      case 'SET_WARNINGS':
        return produce(state, draftState => {
          draftState.warnings[action.entity] = action.payload;
        });
      case 'SET_CONTENT':
        return produce(state, draftState => {
          draftState.content[action.entity] = action.payload;
        });
      case 'SET_SELECTED_IAM_ENTITY':
        return produce(state, draftState => {
          draftState.selectedIAMEntity = action.payload;
        });
      default:
        return state;
    }
  };

  const [codeEditorState, dispatch] = useReducer(codeEditorReducer, {
    errors: {
      [IAMNodeEntity.Policy]: [],
      [IAMNodeEntity.Role]: [],
    },
    warnings: {
      [IAMNodeEntity.Policy]: [],
      [IAMNodeEntity.Role]: [],
    },
    content: {
      [IAMNodeEntity.Policy]: JSON.stringify(MANAGED_POLICIES.AWSS3ReadOnlyAccess, null, 2),
      [IAMNodeEntity.Role]: JSON.stringify(MANAGED_POLICIES.AWSS3ReadOnlyAccess, null, 2),
    },
    selectedIAMEntity: IAMNodeEntity.Policy,
  });

  const selectedIAMEntity = codeEditorState.selectedIAMEntity;

  const setErrors = (entity: IAMScriptableEntity, newErrors: Diagnostic[]): void => {
    dispatch({ type: 'SET_ERRORS', entity, payload: newErrors });
  };

  const setWarnings = (entity: IAMScriptableEntity, newWarnings: string[]): void => {
    dispatch({ type: 'SET_WARNINGS', entity, payload: newWarnings });
  };

  const setContent = (entity: IAMScriptableEntity, newContent: string): void => {
    dispatch({ type: 'SET_CONTENT', entity, payload: newContent });
  };

  const setSelectedIAMEntity = (entity: IAMScriptableEntity): void => {
    dispatch({ type: 'SET_SELECTED_IAM_ENTITY', payload: entity });
  };

  const closeCodeEditor = (): void => {
    CodeEditorPopupStore.send({ type: 'close' });
  };

  const submit = (): void => {
    if (!codeEditorRef.current || !codeEditorRef.current.view) {
      return;
    }

    if (codeEditorMode === CodeEditorMode.Create) {
      levelActor.send({ type: 'ADD_IAM_POLICY_NODE', editor_view: codeEditorRef.current.view });
    } else {
      const updatedProps = { code: codeEditorRef.current.view.state.doc.toString() };
      levelActor.send({ type: 'UPDATE_IAM_NODE', props: updatedProps, node_id: selectedNodeId! });
    }

    closeCodeEditor();
  };

  return (
    <Modal isOpen={isCodeEditorOpen} onClose={closeCodeEditor} id='modal_content'>
      <ModalOverlay />
      <ModalContent maxW={theme.sizes.modalsMaxWidthInPixels}>
        <ModalHeader>
          <CodeEditorHeader
            selectedIAMEntity={selectedIAMEntity}
            setSelectedIAMEntity={setSelectedIAMEntity}
            codeEditorMode={codeEditorMode}
          />
        </ModalHeader>
        <ModalBody>
          <CodeEditorWindow
            setErrors={_.partial(setErrors, selectedIAMEntity)}
            setWarnings={_.partial(setWarnings, selectedIAMEntity)}
            setContent={_.partial(setContent, selectedIAMEntity)}
            content={codeEditorState.content[selectedIAMEntity]}
            setIsLinting={setIsLinting}
            ref={codeEditorRef}
            policyRoleObjectives={policyRoleObjectives}
            selectedIAMEntity={selectedIAMEntity}
          />
          <CodeEditorErrorsBox errors={codeEditorState.errors[selectedIAMEntity]} />
          <CodeEditorWarningsBox warnings={codeEditorState.warnings[selectedIAMEntity]} />
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme='blue'
            mr={3}
            onClick={submit}
            isDisabled={!_.isEmpty(codeEditorState.errors[selectedIAMEntity])}
            isLoading={isLinting}
            loadingText='Checking...'
          >
            Submit
          </Button>
          <Button variant='ghost' onClick={closeCodeEditor}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
