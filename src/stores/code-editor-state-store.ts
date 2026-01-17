import { Diagnostic } from '@codemirror/lint';
import { createStoreWithProducer } from '@xstate/store';
import { produce } from 'immer';
import { reduce } from 'lodash';

import { IAMCodeDefinedEntities } from '@/config/consts';
import { IAMCodeDefinedEntity, IAMNodeEntity } from '@/types/iam-enums';

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
  deinitializeCodeEditor: { nodeId: string };
  selectPolicy: { policyId: string };
  deselectPolicy: { policyId: string };
  setSelectedAccount: { selectedAccountId: string };
  showHelpPopup: { type: string; entity: IAMCodeDefinedEntity };
  hideHelpPopup: { type: string };
  setNodeLabel: { label: string; entity: IAMCodeDefinedEntity };
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
  errors: Record<IAMCodeDefinedEntity, Record<string, Diagnostic[]>>;
  warnings: Record<IAMCodeDefinedEntity, Record<string, string[]>>;
  content: Record<IAMCodeDefinedEntity, Record<string, string>>;
  label: Record<IAMCodeDefinedEntity, string>;
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

const createEntityRecord = <T>(defaultValue: T): Record<IAMCodeDefinedEntity, T> =>
  reduce(
    IAMCodeDefinedEntities,
    (acc, entity) => {
      acc[entity] = defaultValue;
      return acc;
    },
    {} as Record<IAMCodeDefinedEntity, T>
  );

export default createStoreWithProducer<CodeEditorState, CodeEditorEvents, Record<string, unknown>>(
  produce,
  {
    context: {
      errors: createEntityRecord<Record<string, Diagnostic[]>>({}),
      warnings: createEntityRecord<Record<string, string[]>>({}),
      content: createEntityRecord<Record<string, string>>({}),
      label: createEntityRecord<string>(''),
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
      setNodeLabel: (
        context: CodeEditorState,
        event: { label: string; entity: IAMCodeDefinedEntity }
      ) => {
        context.isValidating = true;
        context.label[event.entity] = event.label;
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
