import { Diagnostic } from '@codemirror/lint';
import { createStoreWithProducer } from '@xstate/store';
import { produce } from 'immer';

import { IAMNodeEntity, IAMScriptableEntity } from '@/types';

type CodeEditorEvents = {
  setErrorsAndWarnings: {
    errors: Diagnostic[];
    warnings: string[];
    nodeId: string;
    entity: IAMScriptableEntity;
  };
  setContent: { nodeId: string; content: string; entity: IAMScriptableEntity };
  setSelectedIAMEntity: { payload: IAMScriptableEntity };
  setIsValidating: { payload: boolean };
  initializeCodeEditor: { content: string; nodeId: string; entity: IAMScriptableEntity };
  deinitializeCodeEditor: { nodeId: string };
  selectPolicy: { policyId: string };
  deselectPolicy: { policyId: string };
};

export type CodeEditorState = {
  errors: Record<IAMScriptableEntity, Record<string, Diagnostic[]>>;
  warnings: Record<IAMScriptableEntity, Record<string, string[]>>;
  content: Record<IAMScriptableEntity, Record<string, string>>;
  selectedIAMEntity: IAMScriptableEntity;
  isValidating?: boolean;
  isCodeEditorInitialized: boolean;
  selectedPolicies: string[];
};

export default createStoreWithProducer<CodeEditorState, CodeEditorEvents>(produce, {
  context: {
    errors: { [IAMNodeEntity.Policy]: {}, [IAMNodeEntity.Role]: {} },
    warnings: { [IAMNodeEntity.Policy]: {}, [IAMNodeEntity.Role]: {} },
    content: { [IAMNodeEntity.Policy]: {}, [IAMNodeEntity.Role]: {} },
    selectedIAMEntity: IAMNodeEntity.Policy,
    isCodeEditorInitialized: false,
    selectedPolicies: [],
  },
  on: {
    setErrorsAndWarnings: (
      context: CodeEditorState,
      event: {
        errors: Diagnostic[];
        warnings: string[];
        nodeId: string;
        entity: IAMScriptableEntity;
      }
    ) => {
      context.errors[event.entity] = { [event.nodeId]: event.errors };
      context.warnings[event.entity] = { [event.nodeId]: event.warnings };
    },
    setContent: (
      context: CodeEditorState,
      event: { content: string; nodeId: string; entity: IAMScriptableEntity }
    ) => {
      context.isValidating = true;
      context.content[event.entity] = { [event.nodeId]: event.content };
    },
    setSelectedIAMEntity: (context: CodeEditorState, event: { payload: IAMScriptableEntity }) => {
      context.selectedIAMEntity = event.payload;
    },
    setIsValidating: (context: CodeEditorState, event: { payload: boolean }) => {
      context.isValidating = event.payload;
    },
    initializeCodeEditor: (
      context: CodeEditorState,
      event: { content: string; nodeId: string; entity: IAMScriptableEntity }
    ) => {
      context.isCodeEditorInitialized = true;

      context.content[event.entity][event.nodeId] = event.content;
      context.errors[event.entity][event.nodeId] = [];
      context.warnings[event.entity][event.nodeId] = [];
    },
    deinitializeCodeEditor: (context: CodeEditorState) => {
      context.isCodeEditorInitialized = false;
      context.isValidating = false;
      context.selectedIAMEntity = IAMNodeEntity.Policy;
      context.errors = { [IAMNodeEntity.Policy]: {}, [IAMNodeEntity.Role]: {} };
      context.warnings = { [IAMNodeEntity.Policy]: {}, [IAMNodeEntity.Role]: {} };
      context.content = { [IAMNodeEntity.Policy]: {}, [IAMNodeEntity.Role]: {} };
    },
    selectPolicy: (context: CodeEditorState, event: { policyId: string }) => {
      context.selectedPolicies.push(event.policyId);
    },
    deselectPolicy: (context: CodeEditorState, event: { policyId: string }) => {
      context.selectedPolicies = context.selectedPolicies.filter(
        selectedPolicy => selectedPolicy !== event.policyId
      );
    },
  },
});
