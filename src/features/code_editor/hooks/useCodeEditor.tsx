import { useReducer } from 'react';

import { Diagnostic } from '@codemirror/lint';

import useModal from '@/hooks/useModal';
import { ModalContextState } from '@/types';
import { IAMNodeEntity, IAMScriptableEntity } from '@/types';

export const defaultRole = JSON.stringify(
  {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Principal: {
          Service: 'ec2.amazonaws.com',
        },
        Action: 'sts:AssumeRole',
      },
    ],
  },
  null,
  2
);

const defaultPolicy = JSON.stringify(
  {
    Version: '2012-10-17',
    Statement: [{ Effect: 'Allow', Action: '*', Resource: '*' }],
  },
  null,
  2
);

const MODAL_ID = 'code-editor';

interface Errors {
  policy: Diagnostic[];
  role: Diagnostic[];
}

interface Content {
  policy: string;
  role: string;
}

interface CodeEditorContextState extends ModalContextState {
  errors: Errors;
  content: Content;
  setErrors: (entity: IAMScriptableEntity, newErrors: Diagnostic[]) => void;
  setContent: (entity: IAMScriptableEntity, newContent: string) => void;
  closeCodeEditor: () => void;
  openCodeEditor: () => void;
  isCodeEditorOpen: boolean;
}

type ErrorsAction =
  | { type: 'SET_POLICY_ERROR'; payload: Diagnostic[] }
  | { type: 'SET_ROLE_ERROR'; payload: Diagnostic[] };

type ContentAction =
  | { type: 'SET_POLICY_CONTENT'; payload: string }
  | { type: 'SET_ROLE_CONTENT'; payload: string };

const errorsReducer = (state: Errors, action: ErrorsAction): Errors => {
  switch (action.type) {
    case 'SET_POLICY_ERROR':
      return { ...state, policy: action.payload };
    case 'SET_ROLE_ERROR':
      return { ...state, role: action.payload };
    default:
      return state;
  }
};

const contentReducer = (state: Content, action: ContentAction): Content => {
  switch (action.type) {
    case 'SET_POLICY_CONTENT':
      return { ...state, policy: action.payload };
    case 'SET_ROLE_CONTENT':
      return { ...state, role: action.payload };
    default:
      return state;
  }
};

export const useCodeEditor = (): CodeEditorContextState => {
  const context = useModal();

  if (!context) {
    throw new Error('useCodeEditor must be used within a ModalProvider');
  }

  const [errors, dispatchErrors] = useReducer(errorsReducer, { policy: [], role: [] });
  const [content, dispatchContent] = useReducer(contentReducer, {
    policy: defaultPolicy,
    role: defaultRole,
  });

  const setErrors = (entity: IAMScriptableEntity, newErrors: Diagnostic[]): void => {
    const action = entity === IAMNodeEntity.Policy ? 'SET_POLICY_ERROR' : 'SET_ROLE_ERROR';
    dispatchErrors({ type: action, payload: newErrors });
  };

  const setContent = (entity: IAMScriptableEntity, newContent: string): void => {
    const action = entity === IAMNodeEntity.Policy ? 'SET_POLICY_CONTENT' : 'SET_ROLE_CONTENT';
    dispatchContent({ type: action, payload: newContent });
  };

  const closeCodeEditor = (): void => context.closeModal(MODAL_ID);
  const openCodeEditor = (): void => context.openModal(MODAL_ID);
  const isCodeEditorOpen = context.isModalOpen[MODAL_ID];

  return {
    ...context,
    errors,
    content,
    setErrors,
    setContent,
    closeCodeEditor,
    openCodeEditor,
    isCodeEditorOpen,
  };
};
