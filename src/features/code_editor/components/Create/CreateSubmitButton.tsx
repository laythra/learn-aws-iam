import { Button } from '@chakra-ui/react';
import { EditorView } from '@uiw/react-codemirror';
import { useSelector } from '@xstate/store/react';
import _ from 'lodash';

import codeEditorStateStore from '../../stores/code-editor-state-store';
import { LevelsProgressionContext } from '@/components/providers/LevelsProgressionProvider';
import codeEditorPopupStore from '@/stores/code-editor-popup-store';

interface CreateSubmitButtonProps {
  nodeId: string;
  editorView: EditorView | undefined;
}

export const CreateSubmitButton: React.FC<CreateSubmitButtonProps> = ({ nodeId, editorView }) => {
  const levelActor = LevelsProgressionContext.useActorRef();
  const { errors, isValidating } = useSelector(codeEditorStateStore, state =>
    _.pick(state.context, ['errors', 'isValidating'])
  );

  const isButtonDisabled = !_.isEmpty(errors[nodeId]);

  const submit = (): void => {
    if (!editorView) return;

    levelActor.send({ type: 'ADD_IAM_POLICY_NODE', editor_view: editorView });
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
