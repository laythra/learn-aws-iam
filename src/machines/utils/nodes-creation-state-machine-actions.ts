import { produce, WritableDraft } from 'immer';
import _ from 'lodash';

import { updateConnectionEdges } from './edges-creation-state-machine-actions';
import { AccountID, BaseFinishEventMap, GenericContext, ObjectiveType } from '../types';
import { createGroupNode } from '@/factories/nodes/group-node-factory';
import { createPolicyNode } from '@/factories/nodes/policy-node-factory';
import { createRoleNode } from '@/factories/nodes/role-node-factory';
import { createUserNode } from '@/factories/nodes/user-node-factory';
import { IAMGroupNode, IAMNodeEntity, IAMPolicyNode, IAMRoleNode, IAMUserNode } from '@/types';
import { findAnyValidObjective } from '@/utils/iam-code-linter';

export function createTrustPolicy<TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
  context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
  docString: string,
  label: string,
  accountId?: AccountID
): {
  updatedContext: GenericContext<TLevelObjectiveID, TFinishEventMap>;
  events: TFinishEventMap[ObjectiveType.POLICY_CREATION_OBJECTIVE][];
} {
  const targetValidObjective = findAnyValidObjective<IAMNodeEntity.Role>(
    context.role_creation_objectives,
    context.nodes,
    docString,
    accountId,
    IAMNodeEntity.Role
  );

  const sideEffectsEvents: TFinishEventMap[ObjectiveType.POLICY_CREATION_OBJECTIVE][] = [];
  const newRoleNode = createRoleNode({
    dataOverrides: {
      id: targetValidObjective?.entity_id ?? _.uniqueId('policy-'),
      content: docString,
      label: label,
      unnecessary_node: targetValidObjective === undefined,
      initial_position: targetValidObjective?.created_node_initial_position ?? 'center',
      account_id: accountId,
      editable: false,
    },
  });

  const updatedContext = produce(context, draftContext => {
    draftContext.nodes.push(newRoleNode as WritableDraft<IAMRoleNode>);
    if (targetValidObjective) {
      draftContext.role_creation_objectives.find(
        obj => obj.id === targetValidObjective.id
      )!.finished = true;
    }
  });

  if (targetValidObjective) {
    sideEffectsEvents.push(targetValidObjective.on_finish_event);
  }

  return { updatedContext, events: sideEffectsEvents };
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
  const targetValidObjective = findAnyValidObjective<IAMNodeEntity.Policy>(
    context.policy_creation_objectives,
    context.nodes,
    docString,
    accountId,
    IAMNodeEntity.Policy
  );

  const sideEffectsEvents: TFinishEventMap[ObjectiveType.POLICY_CREATION_OBJECTIVE][] = [];
  const newPolicyNode = createPolicyNode({
    dataOverrides: {
      id: targetValidObjective?.entity_id ?? _.uniqueId('policy-'),
      content: docString,
      label: label,
      unnecessary_node: targetValidObjective === undefined,
      granted_accesses: targetValidObjective?.granted_accesses ?? [],
      initial_position: targetValidObjective?.created_node_initial_position ?? 'center',
      account_id: accountId,
      editable: false,
    },
  });

  let updatedContext = produce(context, draftContext => {
    draftContext.nodes.push(newPolicyNode as WritableDraft<IAMPolicyNode>);
  });

  const nodeById = _.keyBy(updatedContext.nodes, 'id');

  if (targetValidObjective) {
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

export function createUserGroupNode<TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
  context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
  nodeType: IAMNodeEntity.Group | IAMNodeEntity.User,
  props:
    | Omit<Partial<IAMGroupNode['data']>, 'entity'>
    | Omit<Partial<IAMUserNode['data']>, 'entity'>
): {
  updatedContext: GenericContext<TLevelObjectiveID, TFinishEventMap>;
  events: TFinishEventMap[ObjectiveType.IAM_USER_GROUP_CREATION_OBJECTIVE][];
} {
  let events: TFinishEventMap[ObjectiveType.IAM_USER_GROUP_CREATION_OBJECTIVE][] = [];
  const updatedContext = produce(context, draftContext => {
    const targetObjective = draftContext.user_group_creation_objectives.find(
      objective => objective.entity_to_create === nodeType && !objective.finished
    );
    const creationFunc = nodeType === IAMNodeEntity.Group ? createGroupNode : createUserNode;
    const newNode = creationFunc({
      dataOverrides: {
        id: targetObjective?.entity_id ?? _.uniqueId('node_'),
        initial_position: targetObjective?.initial_position ?? 'center',
        unnecessary_node: targetObjective === undefined,
        ...props,
      },
    });

    draftContext.nodes.push(newNode as WritableDraft<IAMGroupNode | IAMUserNode>);
    if (targetObjective) {
      targetObjective.finished = true;
      events = [targetObjective.on_finish_event];
    }
  });

  return {
    updatedContext,
    events,
  };
}
