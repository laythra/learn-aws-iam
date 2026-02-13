import { Button } from '@chakra-ui/react';
import { useSelector } from '@xstate/store/react';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import pick from 'lodash/pick';

import { useLevelActor } from '@/app_shell/runtime/level-runtime';
import codeEditorStateStore from '@/stores/code-editor-state-store';
import { IAMCodeDefinedEntity } from '@/types/iam-enums';
import { StatefulStateMachineEvent } from '@/types/state-machine-event-enums';

interface EditSubmitButtonProps {
  nodeId: string;
  selectedIAMEntity: IAMCodeDefinedEntity;
}

export const EditSubmitButton: React.FC<EditSubmitButtonProps> = ({ nodeId }) => {
  const levelActor = useLevelActor();
  const { errors, warnings, isValidating } = useSelector(
    codeEditorStateStore,
    state => pick(state.context, ['errors', 'warnings', 'isValidating']),
    isEqual
  );

  const isButtonDisabled = !isEmpty(errors[nodeId]) || !isEmpty(warnings[nodeId]);

  const submit = (): void => {
    // Stringify and parse to ensure we get a clean, indented JSON object
    const content = JSON.stringify(
      JSON.parse(codeEditorStateStore.getSnapshot().context.content[nodeId]),
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
