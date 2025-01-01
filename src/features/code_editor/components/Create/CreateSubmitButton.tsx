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
  const levelActor = LevelsProgressionContext.useActorRef();
  const { errors, isValidating } = useSelector(
    codeEditorStateStore,
    state => _.pick(state.context, ['errors', 'isValidating']),
    _.isEqual
  );

  const isButtonDisabled = !_.isEmpty(errors[selectedIAMEntity][nodeId]);

  const submit = (): void => {
    const content = codeEditorStateStore.getSnapshot().context.content[selectedIAMEntity][nodeId];

    if (selectedIAMEntity == IAMNodeEntity.Policy) {
      levelActor.send({
        type: 'ADD_IAM_POLICY_NODE',
        doc_string: content,
      });
    } else {
      levelActor.send({
        type: StatefulStateMachineEvent.ADDIAMRoleNode,
        doc_string: content,
      });
    }

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
