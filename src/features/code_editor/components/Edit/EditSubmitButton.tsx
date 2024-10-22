import { Button } from '@chakra-ui/react';
import { EditorView } from '@uiw/react-codemirror';
import { useSelector } from '@xstate/store/react';
import _ from 'lodash';

import codeEditorStateStore from '../../stores/code-editor-state-store';
import { LevelsProgressionContext } from '@/components/providers/LevelsProgressionProvider';
import codeEditorPopupStore from '@/stores/code-editor-popup-store';

interface EditSubmitButtonProps {
  nodeId: string;
  editorView: EditorView | undefined;
}

export const EditSubmitButton: React.FC<EditSubmitButtonProps> = ({ nodeId, editorView }) => {
  const levelActor = LevelsProgressionContext.useActorRef();
  const { errors, warnings, isValidating } = useSelector(
    codeEditorStateStore,
    state => _.pick(state.context, ['errors', 'warnings', 'isValidating']),
    _.isEqual
  );

  const isButtonDisabled = !_.isEmpty(errors[nodeId]) || !_.isEmpty(warnings[nodeId]);

  const submit = (): void => {
    if (!editorView) return;

    const updatedProps = { code: editorView.state.doc.toString() };
    levelActor.send({ type: 'UPDATE_IAM_NODE', props: updatedProps, node_id: nodeId });
    codeEditorPopupStore.send({ type: 'close' });
  };

  return (
    <Button
      colorScheme='blue'
      mr={3}
      onClick={submit}
      isDisabled={isButtonDisabled}
      isLoading={isValidating}
      loadingText='Checking...'
    >
      Submit
    </Button>
  );
};
