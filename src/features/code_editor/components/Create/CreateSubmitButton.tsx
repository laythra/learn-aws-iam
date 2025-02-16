import { Button } from '@chakra-ui/react';
import { useSelector } from '@xstate/store/react';
import _ from 'lodash';

import codeEditorStateStore from '../../stores/code-editor-state-store';
import { LevelsProgressionContext } from '@/components/providers/LevelsProgressionProvider';
import codeEditorPopupStore from '@/stores/code-editor-popup-store';
import { IAMNodeEntity, IAMScriptableEntity } from '@/types';
import { StatefulStateMachineEvent } from '@/types/state-machine-event-enums';

interface CreateSubmitButtonProps {
  nodeId: string;
  selectedIAMEntity: IAMScriptableEntity;
}

export const CreateSubmitButton: React.FC<CreateSubmitButtonProps> = ({
  nodeId,
  selectedIAMEntity,
}) => {
  const levelActor = LevelsProgressionContext().useActorRef();
  const { errors, isValidating } = useSelector(
    codeEditorStateStore,
    state => _.pick(state.context, ['errors', 'isValidating']),
    _.isEqual
  );

  const isButtonDisabled = !_.isEmpty(errors[selectedIAMEntity][nodeId]);

  const submit = (): void => {
    const content = codeEditorStateStore.getSnapshot().context.content[selectedIAMEntity][nodeId];
    const accountId = codeEditorStateStore.getSnapshot().context.selectedAccountId;

    // TODO: Create policies and roles through the same state machine event
    if (selectedIAMEntity == IAMNodeEntity.Policy) {
      levelActor.send({
        type: 'ADD_IAM_POLICY_NODE',
        doc_string: content,
        account_id: accountId,
      });
    } else {
      levelActor.send({
        type: StatefulStateMachineEvent.ADDIAMRoleNode,
        doc_string: content,
        account_id: accountId,
      });
    }

    codeEditorStateStore.send({ type: 'deinitializeCodeEditor', nodeId });
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
