import { Diagnostic } from '@codemirror/lint';
import { createStoreWithProducer } from '@xstate/store';
import { produce } from 'immer';
import { reduce } from 'lodash';

import { IAMCodeDefinedEntities } from '@/config/consts';
import { AccountID } from '@/machines/types';
import { IAMCodeDefinedEntity, IAMNodeEntity } from '@/types';

type CodeEditorEvents = {
  setCodeErrorsAndWarnings: {
    errors: Diagnostic[];
    warnings: string[];
    nodeId: string;
    entity: IAMCodeDefinedEntity;
  };
  setContent: { nodeId: string; content: string; entity: IAMCodeDefinedEntity };
  setSelectedIAMEntity: { payload: IAMCodeDefinedEntity };
  setIsValidating: { payload: boolean };
  initializeCodeEditor: { content: string; nodeId: string; entity: IAMCodeDefinedEntity };
  deinitializeCodeEditor: { nodeId: string };
  selectPolicy: { policyId: string };
  deselectPolicy: { policyId: string };
  setSelectedAccount: { selectedAccountId: AccountID };
  showHelpPopup: { type: string; entity: IAMCodeDefinedEntity };
  hideHelpPopup: { type: string };
  setNodeLabel: { label: string };
  setNodeLabelError: { error: string | undefined; isValidating: boolean };
};

export type CodeEditorState = {
  errors: Record<IAMCodeDefinedEntity, Record<string, Diagnostic[]>>;
  warnings: Record<IAMCodeDefinedEntity, Record<string, string[]>>;
  content: Record<IAMCodeDefinedEntity, Record<string, string>>;
  selectedIAMEntity: IAMCodeDefinedEntity;
  isValidating?: boolean;
  isCodeEditorInitialized: boolean;
  selectedPolicies: string[];
  selectedAccountId?: AccountID;
  helpPopupInfo: {
    isOpen: boolean;
    entity: IAMCodeDefinedEntity;
  };
  label?: string;
  labelError: string | undefined;
};

export default createStoreWithProducer<CodeEditorState, CodeEditorEvents>(produce, {
  context: {
    errors: reduce(
      IAMCodeDefinedEntities,
      (acc, entity) => {
        acc[entity] = {};
        return acc;
      },
      {} as Record<IAMCodeDefinedEntity, Record<string, Diagnostic[]>>
    ),
    warnings: reduce(
      IAMCodeDefinedEntities,
      (acc, entity) => {
        acc[entity] = {};
        return acc;
      },
      {} as Record<IAMCodeDefinedEntity, Record<string, string[]>>
    ),
    content: reduce(
      IAMCodeDefinedEntities,
      (acc, entity) => {
        acc[entity] = {};
        return acc;
      },
      {} as Record<IAMCodeDefinedEntity, Record<string, string>>
    ),
    selectedIAMEntity: IAMNodeEntity.Policy,
    isCodeEditorInitialized: false,
    selectedPolicies: [],
    selectedAccountId: AccountID.Trusted,
    helpPopupInfo: { isOpen: false, entity: IAMNodeEntity.Policy },
    labelError: undefined,
  },
  on: {
    setCodeErrorsAndWarnings: (
      context: CodeEditorState,
      event: {
        errors: Diagnostic[];
        warnings: string[];
        nodeId: string;
        entity: IAMCodeDefinedEntity;
      }
    ) => {
      context.errors[event.entity] = { [event.nodeId]: event.errors };
      context.warnings[event.entity] = { [event.nodeId]: event.warnings };
    },
    setContent: (
      context: CodeEditorState,
      event: { content: string; nodeId: string; entity: IAMCodeDefinedEntity }
    ) => {
      context.isValidating = true;
      context.content[event.entity] = { [event.nodeId]: event.content };
    },
    setSelectedIAMEntity: (context: CodeEditorState, event: { payload: IAMCodeDefinedEntity }) => {
      context.selectedIAMEntity = event.payload;
    },
    setIsValidating: (context: CodeEditorState, event: { payload: boolean }) => {
      context.isValidating = event.payload;
    },
    initializeCodeEditor: (
      context: CodeEditorState,
      event: { content: string; nodeId: string; entity: IAMCodeDefinedEntity }
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
      context.errors = IAMCodeDefinedEntities.reduce(
        (acc, entity) => {
          acc[entity] = {};
          return acc;
        },
        {} as Record<IAMCodeDefinedEntity, Record<string, Diagnostic[]>>
      );
      context.warnings = IAMCodeDefinedEntities.reduce(
        (acc, entity) => {
          acc[entity] = {};
          return acc;
        },
        {} as Record<IAMCodeDefinedEntity, Record<string, string[]>>
      );
      context.content = IAMCodeDefinedEntities.reduce(
        (acc, entity) => {
          acc[entity] = {};
          return acc;
        },
        {} as Record<IAMCodeDefinedEntity, Record<string, string>>
      );
      context.labelError = undefined;
    },
    selectPolicy: (context: CodeEditorState, event: { policyId: string }) => {
      context.selectedPolicies.push(event.policyId);
    },
    deselectPolicy: (context: CodeEditorState, event: { policyId: string }) => {
      context.selectedPolicies = context.selectedPolicies.filter(
        selectedPolicy => selectedPolicy !== event.policyId
      );
    },
    setSelectedAccount: (context: CodeEditorState, event: { selectedAccountId: AccountID }) => {
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
    setNodeLabel: (context: CodeEditorState, event: { label: string }) => {
      context.isValidating = true;
      context.label = event.label;
    },
    setNodeLabelError: (
      context: CodeEditorState,
      event: { error: string | undefined; isValidating: boolean }
    ) => {
      context.labelError = event.error;
      context.isValidating = event.isValidating;
    },
  },
});
