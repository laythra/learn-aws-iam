import { produce, WritableDraft } from 'immer';
import _ from 'lodash';

import {
  AccountID,
  BaseFinishEventMap,
  GenericContext,
  IAMRoleCreationObjective,
  LevelObjective,
  ObjectiveType,
} from '../types';
import { ElementID } from '@/config/element-ids';
import { createRoleNode } from '@/factories/role-node-factory';
import { IAMAnyNode, IAMNodeEntity, IAMPolicyNode, IAMRoleNode } from '@/types';
import { findAnyValidRole, isJSONValid } from '@/utils/iam-code-linter';
import { isNodeOfEntity } from '@/utils/node-type-guards';

export function changeLevelObjectiveProgress<
  TLevelObjectiveID,
  TFinishEventMap extends BaseFinishEventMap,
>(
  context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
  id: string,
  finished: boolean
): LevelObjective<TLevelObjectiveID, TFinishEventMap>[] {
  return produce(context.level_objectives, draftLevelObjectives => {
    const targetObjective = draftLevelObjectives.find(objective => objective.id === id);
    if (!targetObjective) return;

    targetObjective.finished = finished;
  });
}
/**
 * Edits the IAM Policy and checks if an associated edit objective is finished.
 *
 * If the edit objective is finished, the following happens:
 * - The objective's `on_finish_event` is pushed to the `nodeEditFinishEvents` array to be triggered.
 * - All associated users and groups have their edges updated according to the finished objective's
 *   `granted_accesses` and `revoked_accesses` properties.
 *
 * @template TEditFinishEvent - An enum representing the edit finish event.
 * @param context The current state machine context
 * @param nodeId The node ID of the policy being edited
 * @returns Updated array of node edit finish events.
 */
export function editIAMPolicyNode<TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
  context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
  nodeId: string,
  docString: string
): {
  updatedContext: GenericContext<TLevelObjectiveID, TFinishEventMap>;
  nodeEditFinishEvents: TFinishEventMap[ObjectiveType.POLICY_EDIT_OBJECTIVE][];
} {
  const targetEditObjective = context.policy_edit_objectives.find(
    objective => objective.entity_id === nodeId
  );

  if (!targetEditObjective || !isJSONValid(docString, targetEditObjective.validate_function)) {
    return { updatedContext: context, nodeEditFinishEvents: [] };
  }

  const updatedContext = produce(context, draftContext => {
    const targetNode = draftContext.nodes.find(
      node => node.id === nodeId && isNodeOfEntity(node, IAMNodeEntity.Policy)
    ) as WritableDraft<IAMPolicyNode>;

    if (!targetNode) return;

    targetNode.data.content = docString;
    targetNode.data.editable = false;
    targetNode.data.granted_accesses = targetEditObjective.resources_to_grant;
  });

  return {
    updatedContext,
    nodeEditFinishEvents: [targetEditObjective.on_finish_event],
  };
}

/**
 *  Edits the state of an objective, namely the `finished` property.
 * @param context The current state machine context
 * @param objectiveId The ID of the objective to edit
 * @param finished The new `finished` state of the objective
 * @returns Updated array of level objectives.
 */
export function editObjectiveState<TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
  context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
  objectiveId: string,
  finished: boolean
): LevelObjective<TLevelObjectiveID, TFinishEventMap>[] {
  return produce(context.level_objectives, draftLevelObjectives => {
    const targetObjective = draftLevelObjectives.find(objective => objective.id === objectiveId);
    if (!targetObjective) return;

    targetObjective.finished = finished;
  });
}

export function createIAMRoleNode<TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
  context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
  docString: string,
  label: string,
  accountId?: AccountID
): [
  IAMAnyNode[],
  IAMRoleCreationObjective<TFinishEventMap>[],
  TFinishEventMap[ObjectiveType.POLICY_CREATION_OBJECTIVE][],
] {
  const targetValidObjective = findAnyValidRole(
    context.role_creation_objectives,
    docString,
    context.nodes,
    accountId
  );
  const sideEffectsEvents: TFinishEventMap[ObjectiveType.POLICY_CREATION_OBJECTIVE][] = [];

  const newNodes = produce(context.nodes, draftNodes => {
    const newRoleNode = createRoleNode({
      id: targetValidObjective?.entity_id ?? new Date().getTime().toString(),
      content: docString,
      label,
      initial_position: targetValidObjective?.created_node_initial_position ?? 'center',
      editable: true,
      account_id: accountId,
      unnecessary_node: targetValidObjective === undefined,
    });

    draftNodes.push(newRoleNode as WritableDraft<IAMRoleNode>);
    if (targetValidObjective) {
      sideEffectsEvents.push(targetValidObjective.on_finish_event);
    }
  });

  let updatedObjectives = context.role_creation_objectives;

  if (targetValidObjective) {
    updatedObjectives = produce(context.role_creation_objectives, draftObjectives => {
      draftObjectives.find(objective => objective.id === targetValidObjective.id)!.finished = true;
    });
  }

  return [newNodes, updatedObjectives, sideEffectsEvents];
}

export function getElementsWithRedDot<
  TLevelObjectiveID,
  TFinishEventMap extends BaseFinishEventMap,
>(
  context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
  elementIds: ElementID[],
  isRedDotVisible: boolean
): ElementID[] {
  if (isRedDotVisible) {
    return _.uniq([...(context.elements_with_animated_red_dot ?? []), ...elementIds]);
  } else {
    return _.difference(context.elements_with_animated_red_dot ?? [], elementIds);
  }
}
