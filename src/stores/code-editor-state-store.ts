import { Diagnostic } from '@codemirror/lint';
import { createStoreWithProducer } from '@xstate/store';
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

export default createStoreWithProducer<CodeEditorState, CodeEditorEvents, Record<string, unknown>>(
  produce,
  {
    context: {
      errors: {},
      warnings: {},
      content: {},
      label: {},
      selectedIAMEntity: IAMNodeEntity.Policy,
      isCodeEditorInitialized: false,
      selectedPolicies: [],
      selectedAccountId: undefined,
      helpPopupInfo: { isOpen: false, entity: IAMNodeEntity.Policy },
      labelError: undefined,
      isOpen: false,
      mode: 'create',
    },
    on: {
      setCodeErrorsAndWarnings: (
        context: CodeEditorState,
        event: {
          errors: Diagnostic[];
          warnings: string[];
          nodeId: string;
        }
      ) => {
        context.errors[event.nodeId] = event.errors;
        context.warnings[event.nodeId] = event.warnings;
      },
      setContent: (
        context: CodeEditorState,
        event: { content: string | undefined; nodeId: string }
      ) => {
        context.isValidating = true;
        // delete key if content is undefined
        if (event.content === undefined) {
          delete context.content[event.nodeId];
          return;
        }

        context.content[event.nodeId] = event.content;
      },
      clearContent: (context: CodeEditorState, event: { nodeId: string }) => {
        context.isValidating = true;
        delete context.content[event.nodeId];
      },
      setSelectedIAMEntity: (
        context: CodeEditorState,
        event: { payload: IAMCodeDefinedEntity }
      ) => {
        context.selectedIAMEntity = event.payload;
      },
      setIsValidating: (context: CodeEditorState, event: { payload: boolean }) => {
        context.isValidating = event.payload;
      },
      deinitializeCodeEditor: (context: CodeEditorState) => {
        context.isCodeEditorInitialized = false;
        context.isValidating = false;
        context.selectedIAMEntity = IAMNodeEntity.Policy;
        context.errors = {};
        context.warnings = {};
        context.content = {};
        context.label = {};
        context.labelError = undefined;
        context.isOpen = false;
      },
      selectPolicy: (context: CodeEditorState, event: { policyId: string }) => {
        context.selectedPolicies.push(event.policyId);
      },
      deselectPolicy: (context: CodeEditorState, event: { policyId: string }) => {
        context.selectedPolicies = context.selectedPolicies.filter(
          selectedPolicy => selectedPolicy !== event.policyId
        );
      },
      setSelectedAccount: (context: CodeEditorState, event: { selectedAccountId: string }) => {
        context.isValidating = true;
        context.selectedAccountId = event.selectedAccountId;
      },
      showHelpPopup: (context: CodeEditorState, event: { entity: IAMCodeDefinedEntity }) => {
        context.helpPopupInfo = {
          isOpen: true,
          entity: event.entity,
        };
      },
      hideHelpPopup: (context: CodeEditorState) => {
        context.helpPopupInfo = {
          isOpen: false,
          entity: IAMNodeEntity.Policy,
        };
      },
      setNodeLabel: (context: CodeEditorState, event: { label: string; nodeId: string }) => {
        context.isValidating = true;
        context.label[event.nodeId] = event.label;
      },
      setNodeLabelError: (
        context: CodeEditorState,
        event: { error: string | undefined; isValidating: boolean }
      ) => {
        context.labelError = event.error;
        context.isValidating = event.isValidating;
      },
      open: (
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
        context.selectedIAMEntity = event.selectedIAMEntity ?? IAMNodeEntity.Policy;
      },
      close: (context: CodeEditorState) => {
        context.isOpen = false;
      },
    },
  }
);
