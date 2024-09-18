import { useReducer } from 'react';

import { Diagnostic } from '@codemirror/lint';

import useModal from '@/hooks/useModal';
import { ModalContextState } from '@/types';
import { IAMNodeEntity, IAMScriptableEntity } from '@/types';

const MODAL_ID = 'code-editor';

interface CodeEditorState {
  errors: Record<IAMScriptableEntity, Diagnostic[]>;
  warnings: Record<IAMScriptableEntity, string[]>;
  content: Record<IAMScriptableEntity, string>;
}

type Action =
  | { type: 'SET_ERRORS'; entity: IAMScriptableEntity; payload: Diagnostic[] }
  | { type: 'SET_WARNINGS'; entity: IAMScriptableEntity; payload: string[] }
  | { type: 'SET_CONTENT'; entity: IAMScriptableEntity; payload: string };

interface CodeEditorContextState extends ModalContextState {
  errors: CodeEditorState['errors'];
  warnings: CodeEditorState['warnings'];
  content: CodeEditorState['content'];
  setErrors: (entity: IAMScriptableEntity, newErrors: Diagnostic[]) => void;
  setWarnings: (entity: IAMScriptableEntity, newWarnings: string[]) => void;
  setContent: (entity: IAMScriptableEntity, newContent: string) => void;
  closeCodeEditor: () => void;
  openCodeEditor: () => void;
  isCodeEditorOpen: boolean;
}

const codeEditorReducer = (state: CodeEditorState, action: Action): CodeEditorState => {
  switch (action.type) {
    case 'SET_ERRORS':
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.entity]: action.payload,
        },
      };
    case 'SET_WARNINGS':
      return {
        ...state,
        warnings: {
          ...state.warnings,
          [action.entity]: action.payload,
        },
      };
    case 'SET_CONTENT':
      return {
        ...state,
        content: {
          ...state.content,
          [action.entity]: action.payload,
        },
      };
    default:
      return state;
  }
};

export const useCodeEditor = (
  initialPolicyContent?: object,
  initialRoleContent?: object
): CodeEditorContextState => {
  const context = useModal();

  if (!context) {
    throw new Error('useCodeEditor must be used within a ModalProvider');
  }

  const [state, dispatch] = useReducer(codeEditorReducer, {
    errors: {
      [IAMNodeEntity.Policy]: [],
      [IAMNodeEntity.Role]: [],
    },
    warnings: {
      [IAMNodeEntity.Policy]: [],
      [IAMNodeEntity.Role]: [],
    },
    content: {
      [IAMNodeEntity.Policy]: JSON.stringify(initialPolicyContent, null, 2),
      [IAMNodeEntity.Role]: JSON.stringify(initialRoleContent, null, 2),
    },
  });

  const setErrors = (entity: IAMScriptableEntity, newErrors: Diagnostic[]): void => {
    dispatch({ type: 'SET_ERRORS', entity, payload: newErrors });
  };

  const setWarnings = (entity: IAMScriptableEntity, newWarnings: string[]): void => {
    dispatch({ type: 'SET_WARNINGS', entity, payload: newWarnings });
  };

  const setContent = (entity: IAMScriptableEntity, newContent: string): void => {
    dispatch({ type: 'SET_CONTENT', entity, payload: newContent });
  };

  const closeCodeEditor = (): void => context.closeModal(MODAL_ID);
  const openCodeEditor = (): void => context.openModal(MODAL_ID);
  const isCodeEditorOpen = context.isModalOpen[MODAL_ID];

  return {
    ...context,
    errors: state.errors,
    warnings: state.warnings,
    content: state.content,
    setErrors,
    setWarnings,
    setContent,
    closeCodeEditor,
    openCodeEditor,
    isCodeEditorOpen,
  };
};
