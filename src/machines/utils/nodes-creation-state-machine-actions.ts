import { produce } from 'immer';
import _, { update } from 'lodash';
import { Node } from 'reactflow';

import { updateConnectionEdges } from './edges-creation-state-machine-actions';
import { AccountID, BaseFinishEventMap, GenericContext, ObjectiveType } from '../types';
import { createPolicyNode } from '@/factories/policy-node-factory';
import { IAMPolicyNodeData } from '@/types';
import { findAnyValidPolicy } from '@/utils/iam-code-linter';

function isResourceBasePolicy(docString: string): boolean {
  return docString.includes('Principal');
}

export function createPermissionPolicy<
  TLevelObjectiveID,
  TFinishEventMap extends BaseFinishEventMap,
>(
  context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
  docString: string,
  label: string,
  accountId?: AccountID
): {
  updatedContext: GenericContext<TLevelObjectiveID, TFinishEventMap>;
  events: TFinishEventMap[ObjectiveType.POLICY_CREATION_OBJECTIVE][];
} {
  const targetValidObjective = findAnyValidPolicy(
    context.policy_creation_objectives,
    docString,
    accountId
  );

  const sideEffectsEvents: TFinishEventMap[ObjectiveType.POLICY_CREATION_OBJECTIVE][] = [];
  const newPolicyNode = createPolicyNode({
    id: targetValidObjective?.entity_id ?? new Date().getTime().toString(),
    content: docString,
    label: label,
    unnecessary_node: targetValidObjective === undefined,
    granted_accesses: targetValidObjective?.granted_accesses ?? [],
    initial_position: targetValidObjective?.created_node_initial_position ?? 'center',
    account_id: accountId,
    editable: true,
  });

  let updatedContext = produce(context, draftContext => {
    draftContext.nodes.push(newPolicyNode);
  });

  const nodeById = _.keyBy(updatedContext.nodes, 'id');

  if (targetValidObjective) {
    debugger;
    targetValidObjective.initial_edges?.forEach(edge => {
      ({ updatedContext } = updateConnectionEdges(
        updatedContext,
        nodeById[edge.source],
        nodeById[edge.target],
        true,
        { data: edge.data }
      ));
    });

    sideEffectsEvents.push(targetValidObjective.on_finish_event);
  }

  return { updatedContext, events: sideEffectsEvents };
}
