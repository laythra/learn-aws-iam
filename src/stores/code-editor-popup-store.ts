import { createStore } from '@xstate/store';

export enum CodeEditorMode {
  Create = 'CREATE',
  Edit = 'EDIT',
}

type CodeEditorPopupState = {
  isOpen: boolean;
  mode: CodeEditorMode;
  selectedNodeId?: string;
};

type CodeEditorPopupEvents = {
  open: { type: string; mode: CodeEditorMode; selectedNodeId?: string };
  close: { type: string };
};

export default createStore<CodeEditorPopupState, CodeEditorPopupEvents>(
  {
    isOpen: false,
    mode: CodeEditorMode.Create,
  },
  {
    open: (
      _context: CodeEditorPopupState,
      event: { mode: CodeEditorMode; selectedNodeId?: string }
    ) => ({
      isOpen: true,
      mode: event.mode,
      selectedNodeId: event.selectedNodeId,
    }),
    close: () => ({
      isOpen: false,
    }),
  }
);
