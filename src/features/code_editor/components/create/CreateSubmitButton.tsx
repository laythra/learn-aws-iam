import { Button } from '@chakra-ui/react';
import { useSelector } from '@xstate/store-react';
import _ from 'lodash';

import { useLevelActor, useLevelSelector } from '@/runtime/level-runtime';
import codeEditorStateStore from '@/stores/code-editor-state-store';
import { IAMCodeDefinedEntity, IAMNodeEntity } from '@/types/iam-enums';
import { DataEvent } from '@/types/state-machine-event-enums';

interface CreateSubmitButtonProps {
  nodeId: string;
  selectedIAMEntity: IAMCodeDefinedEntity;
}

export const CreateSubmitButton: React.FC<CreateSubmitButtonProps> = ({
  nodeId,
  selectedIAMEntity,
}) => {
  const levelActor = useLevelActor();
  const [codeErrors, labelError, isValidating] = useSelector(
    codeEditorStateStore,
    state => [state.context.errors, state.context.labelError, state.context.isValidating],
    _.isEqual
  );

  const nodes = useLevelSelector(state => state.context.nodes, _.isEqual);

  const isButtonDisabled =
    !_.isEmpty(codeErrors[nodeId]) ||
    (selectedIAMEntity !== IAMNodeEntity.ResourcePolicy && labelError !== undefined);

  const submit = (): void => {
    const codeEditorStateContext = codeEditorStateStore.getSnapshot().context;

    // Stringify and parse to ensure we get a clean, indented JSON object
    const content = JSON.stringify(JSON.parse(codeEditorStateContext.content[nodeId]), null, 2);

    const accountId = codeEditorStateContext.selectedAccountId;
    const label = codeEditorStateContext.label;
    const resourceNodeId = codeEditorStateContext.selectedResourceNodeId;

    const resolvedLabel =
      selectedIAMEntity === IAMNodeEntity.ResourcePolicy
        ? (nodes.find(n => n.id === resourceNodeId)?.data.label ?? 'Resource') + ' Policy'
        : label[nodeId];

    levelActor.send({
      type: DataEvent.AddIAMNode,
      doc_string: content,
      account_id: selectedIAMEntity === IAMNodeEntity.SCP ? undefined : accountId,
      label: resolvedLabel,
      node_entity: selectedIAMEntity,
      resource_node_id:
        selectedIAMEntity === IAMNodeEntity.ResourcePolicy ? resourceNodeId : undefined,
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
