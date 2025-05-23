import { Button } from '@chakra-ui/react';
import { useSelector } from '@xstate/store/react';
import _ from 'lodash';

import codeEditorStateStore from '../../stores/code-editor-state-store';
import { LevelsProgressionContext } from '@/components/providers/LevelsProgressionProvider';
import codeEditorPopupStore from '@/stores/code-editor-popup-store';
import { IAMNodeEntity, IAMCodeDefinedEntity } from '@/types';
import { StatefulStateMachineEvent } from '@/types/state-machine-event-enums';

interface CreateSubmitButtonProps {
  nodeId: string;
  selectedIAMEntity: IAMCodeDefinedEntity;
}

export const CreateSubmitButton: React.FC<CreateSubmitButtonProps> = ({
  nodeId,
  selectedIAMEntity,
}) => {
  const levelActor = LevelsProgressionContext().useActorRef();
  const [codeErrors, labelError, isValidating] = useSelector(
    codeEditorStateStore,
    state => [state.context.errors, state.context.labelError, state.context.isValidating],
    _.isEqual
  );

  const isButtonDisabled =
    !_.isEmpty(codeErrors[selectedIAMEntity][nodeId]) || labelError !== undefined;

  const submit = (): void => {
    const codeEditorStateContext = codeEditorStateStore.getSnapshot().context;
    const content = codeEditorStateContext.content[selectedIAMEntity][nodeId];
    const accountId = codeEditorStateContext.selectedAccountId;
    const label = codeEditorStateContext.label!;

    // TODO: Create policies and roles through the same state machine event
    if (selectedIAMEntity == IAMNodeEntity.Policy) {
      levelActor.send({
        type: StatefulStateMachineEvent.AddIAMPolicyNode,
        doc_string: content,
        account_id: accountId,
        label,
      });
    } else if (selectedIAMEntity == IAMNodeEntity.Role) {
      levelActor.send({
        type: StatefulStateMachineEvent.ADDIAMRoleNode,
        doc_string: content,
        account_id: accountId,
        label,
      });
    } else if (selectedIAMEntity == IAMNodeEntity.SCP) {
      levelActor.send({
        type: StatefulStateMachineEvent.AddIAMSCPNode,
        doc_string: content,
        label,
      });
    } else if (selectedIAMEntity == IAMNodeEntity.ResourcePolicy) {
      levelActor.send({
        type: StatefulStateMachineEvent.AddIAMResourcePolicyNode,
        doc_string: content,
        label,
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
