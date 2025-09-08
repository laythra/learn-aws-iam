import { Button } from '@chakra-ui/react';
import { useSelector } from '@xstate/store/react';
import _ from 'lodash';

import { LevelsProgressionContext } from '@/components/providers/level-actor-contexts';
import codeEditorStateStore from '@/stores/code-editor-state-store';
import { IAMCodeDefinedEntity } from '@/types';
import { StatefulStateMachineEvent } from '@/types/state-machine-event-enums';

interface EditSubmitButtonProps {
  nodeId: string;
  selectedIAMEntity: IAMCodeDefinedEntity;
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
    // Stringify and parse to ensure we get a clean, indented JSON object
    const content = JSON.stringify(
      JSON.parse(codeEditorStateStore.getSnapshot().context.content[selectedIAMEntity][nodeId]),
      null,
      2
    );

    levelActor.send({
      type: StatefulStateMachineEvent.EditIAMPolicyNode,
      doc_string: content,
      node_id: nodeId,
    });

    codeEditorStateStore.send({ type: 'deinitializeCodeEditor', nodeId });
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
