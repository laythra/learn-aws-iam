import { createStore } from '@xstate/store';

export enum CodeEditorMode {
  Create = 'CREATE',
  Edit = 'EDIT',
}

type CodeEditorPopupState = {
  isOpen: boolean;
  mode: CodeEditorMode;
};

type CodeEditorPopupEvents = {
  open: { type: string; mode: CodeEditorMode };
  close: { type: string };
};

export default createStore<CodeEditorPopupState, CodeEditorPopupEvents>(
  {
    isOpen: false,
    mode: CodeEditorMode.Create,
  },
  {
    open: (_context: CodeEditorPopupState, event: { mode: CodeEditorMode }) => ({
      isOpen: true,
      mode: event.mode,
    }),
    close: () => ({
      isOpen: false,
    }),
  }
);
