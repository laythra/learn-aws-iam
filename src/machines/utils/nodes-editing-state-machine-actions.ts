import { produce, WritableDraft } from 'immer';

import { refreshPolicyConnections } from './edges-creation-state-machine-actions';
import { BaseFinishEventMap, GenericContext, ObjectiveType } from '../types';
import { IAMNodeEntity, IAMPolicyNode } from '@/types';
import { isJSONValid } from '@/utils/iam-code-linter';
import { isNodeOfEntity } from '@/utils/node-type-guards';

export function editPermissionPolicy<TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
  context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
  nodeId: string,
  docString: string
): {
  updatedContext: GenericContext<TLevelObjectiveID, TFinishEventMap>;
  events: TFinishEventMap[ObjectiveType.POLICY_CREATION_OBJECTIVE][];
} {
  const targetEditObjective = context.policy_edit_objectives.find(
    objective => objective.entity_id === nodeId
  );

  if (!targetEditObjective || !isJSONValid(docString, targetEditObjective.validate_function)) {
    return { updatedContext: context, events: [] };
  }

  let updatedContext = produce(context, draftContext => {
    const targetNode = draftContext.nodes.find(
      node => node.id === nodeId && isNodeOfEntity(node, IAMNodeEntity.Policy)
    ) as WritableDraft<IAMPolicyNode>;

    if (!targetNode) return;

    targetNode.data.content = docString;
    targetNode.data.editable = false;
    targetNode.data.granted_accesses = targetEditObjective.resources_to_grant;
  });

  ({ updatedContext } = refreshPolicyConnections(
    updatedContext,
    updatedContext.nodes.find(node => node.id === nodeId) as IAMPolicyNode
  ));

  return {
    updatedContext,
    events: [targetEditObjective.on_finish_event],
  };
}
