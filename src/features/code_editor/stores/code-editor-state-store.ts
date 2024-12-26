import { Diagnostic } from '@codemirror/lint';
import { createStoreWithProducer } from '@xstate/store';
import { produce } from 'immer';

import { IAMNodeEntity, IAMScriptableEntity } from '@/types';

type CodeEditorEvents = {
  setErrorsAndWarnings: {
    errors: Diagnostic[];
    warnings: string[];
    nodeId: string;
  };
  setContent: { nodeId: string; content: string };
  setSelectedIAMEntity: { payload: IAMScriptableEntity };
  setIsValidating: { payload: boolean };
  initializeCodeEditor: { content: string; nodeId: string };
  deinitializeCodeEditor: { nodeId: string };
};

export type CodeEditorState = {
  errors: Record<string, Diagnostic[]>;
  warnings: Record<string, string[]>;
  content: Record<string, string>;
  selectedIAMEntity: IAMScriptableEntity;
  isValidating?: boolean;
  isCodeEditorInitialized: boolean;
};

export default createStoreWithProducer<CodeEditorState, CodeEditorEvents>(produce, {
  context: {
    errors: {},
    warnings: {},
    content: {},
    selectedIAMEntity: IAMNodeEntity.Policy,
    isCodeEditorInitialized: false,
  },
  on: {
    setErrorsAndWarnings: (
      context: CodeEditorState,
      event: { errors: Diagnostic[]; warnings: string[]; nodeId: string }
    ) => {
      context.errors[event.nodeId] = event.errors;
      context.warnings[event.nodeId] = event.warnings;
    },
    setContent: (context: CodeEditorState, event: { content: string; nodeId: string }) => {
      context.isValidating = true;
      context.content[event.nodeId] = event.content;
    },
    setSelectedIAMEntity: (context: CodeEditorState, event: { payload: IAMScriptableEntity }) => {
      context.selectedIAMEntity = event.payload;
    },
    setIsValidating: (context: CodeEditorState, event: { payload: boolean }) => {
      context.isValidating = event.payload;
    },
    initializeCodeEditor: (
      context: CodeEditorState,
      event: { content: string; nodeId: string }
    ) => {
      context.isCodeEditorInitialized = true;
      context.content[event.nodeId] = event.content;
      context.errors[event.nodeId] = [];
      context.warnings[event.nodeId] = [];
    },
    deinitializeCodeEditor: (context: CodeEditorState, event: { nodeId: string }) => {
      context.isCodeEditorInitialized = false;
      context.isValidating = false;
      delete context.content[event.nodeId];
    },
  },
});
