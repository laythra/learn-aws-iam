import { EditorState, Extension } from '@codemirror/state';

export function limitLinesFilter(initialCode: string): Extension {
  return EditorState.transactionFilter.of(tr => {
    if (tr.newDoc.lines > initialCode.split('\n').length) {
      return [];
    }
    return tr;
  });
}
