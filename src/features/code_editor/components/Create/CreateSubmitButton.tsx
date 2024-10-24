import { Button } from '@chakra-ui/react';
import { useSelector } from '@xstate/store/react';
import _ from 'lodash';

import codeEditorStateStore from '../../stores/code-editor-state-store';
import { LevelsProgressionContext } from '@/components/providers/LevelsProgressionProvider';
import codeEditorPopupStore from '@/stores/code-editor-popup-store';

interface CreateSubmitButtonProps {
  nodeId: string;
}

export const CreateSubmitButton: React.FC<CreateSubmitButtonProps> = ({ nodeId }) => {
  const levelActor = LevelsProgressionContext.useActorRef();
  const { errors, isValidating } = useSelector(codeEditorStateStore, state =>
    _.pick(state.context, ['errors', 'isValidating'])
  );

  const isButtonDisabled = !_.isEmpty(errors[nodeId]);

  const submit = (): void => {
    const stateSnapshot = codeEditorStateStore.getSnapshot().context;
    const content = stateSnapshot.content[stateSnapshot.selectedIAMEntity];

    levelActor.send({
      type: 'ADD_IAM_POLICY_NODE',
      doc_string: content,
    });
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
