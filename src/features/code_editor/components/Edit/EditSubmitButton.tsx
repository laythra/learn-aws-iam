import { Button } from '@chakra-ui/react';
import { useSelector } from '@xstate/store/react';
import _ from 'lodash';

import codeEditorStateStore from '../../stores/code-editor-state-store';
import { LevelsProgressionContext } from '@/components/providers/LevelsProgressionProvider';
import codeEditorPopupStore from '@/stores/code-editor-popup-store';
import { IAMNodeEntity, IAMScriptableEntity } from '@/types';

interface EditSubmitButtonProps {
  nodeId: string;
  selectedIAMEntity: IAMScriptableEntity;
}

export const EditSubmitButton: React.FC<EditSubmitButtonProps> = ({
  nodeId,
  selectedIAMEntity,
}) => {
  const levelActor = LevelsProgressionContext().useActorRef();
  const { errors, warnings, isValidating } = useSelector(
    codeEditorStateStore,
    state => _.pick(state.context, ['errors', 'warnings', 'isValidating']),
    _.isEqual
  );

  const isButtonDisabled =
    !_.isEmpty(errors[selectedIAMEntity][nodeId]) ||
    !_.isEmpty(warnings[selectedIAMEntity][nodeId]);

  const submit = (): void => {
    const content = codeEditorStateStore.getSnapshot().context.content[selectedIAMEntity][nodeId];

    levelActor.send({ type: 'UPDATE_IAM_POLICY_NODE', doc_string: content, node_id: nodeId });
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
