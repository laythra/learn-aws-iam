import { Diagnostic } from '@codemirror/lint';
import { ModalContextState, IAMNodeEntity } from 'types';

type IAMScriptableEntity = IAMNodeEntity.Policy | IAMNodeEntity.Role;

interface Errors {
  policy: Diagnostic[];
  role: Diagnostic[];
}

interface Content {
  policy: string;
  role: string;
}

export interface CodeEditorContextState extends ModalContextState {
  errors: Errors;
  content: Content;
  setErrors: (newErrors: Diagnostic[], entity: IAMScriptableEntity) => void;
  setContent: (content: string, entity: IAMScriptableEntity) => void;
}

export type ErrorsAction =
  | { type: 'SET_POLICY_ERROR'; payload: Diagnostic[] }
  | { type: 'SET_ROLE_ERROR'; payload: Diagnostic[] };

export type ContentAction =
  | { type: 'SET_POLICY_CONTENT'; payload: string }
  | { type: 'SET_ROLE_CONTENT'; payload: string };
