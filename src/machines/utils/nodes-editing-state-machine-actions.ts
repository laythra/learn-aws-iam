import { produce } from 'immer';

import { ConnectionFilter } from './connection-filter';
import { IAMNodeFilter } from './iam-node-filter';
import { GetLevelValidateFunctions } from '../functions-registry';
import { GenericContext } from '../types/context-types';
import { BaseFinishEventMap, ObjectiveType } from '../types/objective-types';
import { isJSONValid } from '@/lib/iam/iam-code-linter';
import { IAMAnyNode, IAMEdge } from '@/types/iam-node-types';

export function editPermissionPolicy<TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
  context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
  nodeId: string,
  docString: string
): {
  updatedContext: GenericContext<TLevelObjectiveID, TFinishEventMap>;
  events: TFinishEventMap[ObjectiveType.POLICY_CREATION_OBJECTIVE][];
  edgesToRefresh: IAMEdge[];
} {
  const targetEditObjective = context.policy_edit_objectives.find(
    objective => objective.id === nodeId && !objective.finished
  )!;

  const objectiveValidationFn = GetLevelValidateFunctions(context.level_number)[
    targetEditObjective?.validate_fn_name
  ]?.(context.nodes);

  if (!targetEditObjective || !isJSONValid(docString, objectiveValidationFn!)) {
    return { updatedContext: context, events: [], edgesToRefresh: [] };
  }

  const updatedContext = produce(context, draftContext => {
    const targetNode = IAMNodeFilter.create()
      .fromNodes(draftContext.nodes)
      .whereIdIs(nodeId)
      .build()[0];

    if (!targetNode) return;

    draftContext.policy_edit_objectives.find(
      objective => objective.id === targetEditObjective.id
    )!.finished = true;

    targetNode.data.content = docString;
    targetNode.data.editable = false;
    targetNode.data.granted_accesses = targetEditObjective.resources_to_grant;
  });

  const edgesToRefresh = ConnectionFilter.create()
    .fromEdges(context.edges)
    .whereSourceIs(nodeId)
    .build();

  return {
    updatedContext,
    events: [targetEditObjective.on_finish_event],
    edgesToRefresh,
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
): { updatedContext: GenericContext<TLevelObjectiveID, TFinishEventMap>; editedNode: TNode } {
  const updatedContext = produce(context, draftContext => {
    const currentNode = draftContext.nodes.find(node => node.id === nodeId) as TNode;

    currentNode.data = { ...currentNode.data, ...attributes };
  });

  return {
    updatedContext,
    editedNode: updatedContext.nodes.find(node => node.id === nodeId) as TNode,
  };
}
