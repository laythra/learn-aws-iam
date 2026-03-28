import type { Diagnostic } from '@codemirror/lint';
import { createStore } from '@xstate/store';
import { produce } from 'immer';

import { IAMCodeDefinedEntity, IAMNodeEntity } from '@/types/iam-enums';

type CodeEditorEvents = {
  setCodeErrorsAndWarnings: {
    errors: Diagnostic[];
    warnings: string[];
    nodeId: string;
  };
  setContent: { nodeId: string; content: string };
  clearContent: { nodeId: string };
  setSelectedIAMEntity: { payload: IAMCodeDefinedEntity };
  setIsValidating: { payload: boolean };
  deinitializeCodeEditor: { nodeId: string };
  selectPolicy: { policyId: string };
  deselectPolicy: { policyId: string };
  setSelectedAccount: { selectedAccountId: string };
  showHelpPopup: { type: string; entity: IAMCodeDefinedEntity };
  hideHelpPopup: { type: string };
  setNodeLabel: { label: string; nodeId: string };
  setNodeLabelError: { error: string | undefined; isValidating: boolean };
  open: {
    type: string;
    mode: 'create' | 'edit';
    selectedNodeId?: string;
    selectedIAMEntity?: IAMCodeDefinedEntity;
  };
  close: { type: string };
};

export type CodeEditorState = {
  errors: Record<string, Diagnostic[]>;
  warnings: Record<string, string[]>;
  content: Record<string, string>;
  label: Record<string, string>;
  selectedIAMEntity: IAMCodeDefinedEntity;
  isValidating?: boolean;
  isCodeEditorInitialized: boolean;
  selectedPolicies: string[];
  selectedAccountId?: string;
  helpPopupInfo: {
    isOpen: boolean;
    entity: IAMCodeDefinedEntity;
  };
  labelError: string | undefined;
  isOpen: boolean;
  mode: 'create' | 'edit';
  selectedNodeId?: string;
};

export default createStore<CodeEditorState, CodeEditorEvents, never>({
  context: {
    errors: {},
    warnings: {},
    content: {},
    label: {},
    selectedIAMEntity: IAMNodeEntity.IdentityPolicy,
    isCodeEditorInitialized: false,
    selectedPolicies: [],
    selectedAccountId: undefined,
    helpPopupInfo: { isOpen: false, entity: IAMNodeEntity.IdentityPolicy },
    labelError: undefined,
    isOpen: false,
    mode: 'create',
  },
  on: {
    setCodeErrorsAndWarnings: produce(
      (
        context: CodeEditorState,
        event: {
          errors: Diagnostic[];
          warnings: string[];
          nodeId: string;
        }
      ) => {
        context.errors[event.nodeId] = event.errors;
        context.warnings[event.nodeId] = event.warnings;
      }
    ),
    setContent: produce(
      (context: CodeEditorState, event: { content: string | undefined; nodeId: string }) => {
        context.isValidating = true;
        // delete key if content is undefined
        if (event.content === undefined) {
          delete context.content[event.nodeId];
          return;
        }

        context.content[event.nodeId] = event.content;
      }
    ),
    clearContent: produce((context: CodeEditorState, event: { nodeId: string }) => {
      context.isValidating = true;
      delete context.content[event.nodeId];
    }),
    setSelectedIAMEntity: produce(
      (context: CodeEditorState, event: { payload: IAMCodeDefinedEntity }) => {
        context.selectedIAMEntity = event.payload;
      }
    ),
    setIsValidating: produce((context: CodeEditorState, event: { payload: boolean }) => {
      context.isValidating = event.payload;
    }),
    deinitializeCodeEditor: produce((context: CodeEditorState) => {
      context.isCodeEditorInitialized = false;
      context.isValidating = false;
      context.selectedIAMEntity = IAMNodeEntity.IdentityPolicy;
      context.errors = {};
      context.warnings = {};
      context.content = {};
      context.label = {};
      context.labelError = undefined;
      context.isOpen = false;
    }),
    selectPolicy: produce((context: CodeEditorState, event: { policyId: string }) => {
      context.selectedPolicies.push(event.policyId);
    }),
    deselectPolicy: produce((context: CodeEditorState, event: { policyId: string }) => {
      context.selectedPolicies = context.selectedPolicies.filter(
        selectedPolicy => selectedPolicy !== event.policyId
      );
    }),
    setSelectedAccount: produce(
      (context: CodeEditorState, event: { selectedAccountId: string }) => {
        context.isValidating = true;
        context.selectedAccountId = event.selectedAccountId;
      }
    ),
    showHelpPopup: produce((context: CodeEditorState, event: { entity: IAMCodeDefinedEntity }) => {
      context.helpPopupInfo = {
        isOpen: true,
        entity: event.entity,
      };
    }),
    hideHelpPopup: produce((context: CodeEditorState) => {
      context.helpPopupInfo = {
        isOpen: false,
        entity: IAMNodeEntity.IdentityPolicy,
      };
    }),
    setNodeLabel: produce((context: CodeEditorState, event: { label: string; nodeId: string }) => {
      context.isValidating = true;
      context.label[event.nodeId] = event.label;
    }),
    setNodeLabelError: produce(
      (context: CodeEditorState, event: { error: string | undefined; isValidating: boolean }) => {
        context.labelError = event.error;
        context.isValidating = event.isValidating;
      }
    ),
    open: produce(
      (
        context: CodeEditorState,
        event: {
          mode: 'create' | 'edit';
          selectedNodeId?: string;
          selectedIAMEntity?: IAMCodeDefinedEntity;
        }
      ) => {
        context.isOpen = true;
        context.mode = event.mode;
        context.selectedNodeId = event.selectedNodeId;
        context.selectedIAMEntity = event.selectedIAMEntity ?? IAMNodeEntity.IdentityPolicy;
      }
    ),
    close: produce((context: CodeEditorState) => {
      context.isOpen = false;
    }),
  },
});
