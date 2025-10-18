import { produce } from 'immer';

import { refreshPolicyConnections } from './edges-creation-state-machine-actions';
import { IAMNodeFilter } from './iam-node-filter';
import { GetLevelValidateFunctions } from '../functions-registry';
import { BaseFinishEventMap, GenericContext, ObjectiveType } from '../types';
import { IAMAnyNode, IAMPolicyNode } from '@/types';
import { isJSONValid } from '@/utils/iam-code-linter';

export function editPermissionPolicy<TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
  context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
  nodeId: string,
  docString: string
): {
  updatedContext: GenericContext<TLevelObjectiveID, TFinishEventMap>;
  events: TFinishEventMap[ObjectiveType.POLICY_CREATION_OBJECTIVE][];
} {
  const targetEditObjective = context.policy_edit_objectives.find(
    objective => objective.id === nodeId
  )!;

  const objectiveValidationFn = GetLevelValidateFunctions(context.level_number)[
    targetEditObjective?.id
  ]?.(context.nodes);

  if (!targetEditObjective || !isJSONValid(docString, objectiveValidationFn!)) {
    return { updatedContext: context, events: [] };
  }

  let updatedContext = produce(context, draftContext => {
    const targetNode = IAMNodeFilter.create()
      .fromNodes(draftContext.nodes)
      .whereIdIs(nodeId)
      .build()[0];

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

export function editNodeAttributes<
  TLevelObjectiveID,
  TFinishEventMap extends BaseFinishEventMap,
  TNode extends IAMAnyNode,
>(
  context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
  nodeId: string,
  attributes: Partial<TNode['data']>
): GenericContext<TLevelObjectiveID, TFinishEventMap> {
  return produce(context, draftContext => {
    const currentNode = draftContext.nodes.find(node => node.id === nodeId) as TNode;

    currentNode.data = { ...currentNode.data, ...attributes };
  });
}
