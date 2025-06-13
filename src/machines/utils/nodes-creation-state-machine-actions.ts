import { produce, WritableDraft } from 'immer';
import _ from 'lodash';

import { updateConnectionEdges } from './edges-creation-state-machine-actions';
import {
  AccountID,
  BaseCreationObjective,
  BaseFinishEventMap,
  GenericContext,
  ObjectiveType,
} from '../types';
import { createGroupNode } from '@/factories/nodes/group-node-factory';
import { createPolicyNode } from '@/factories/nodes/policy-node-factory';
import { createRoleNode } from '@/factories/nodes/role-node-factory';
import { createSCPNode } from '@/factories/nodes/scp-node-factory';
import { createUserNode } from '@/factories/nodes/user-node-factory';
import {
  IAMAnyNode,
  IAMGroupNode,
  IAMNodeEntity,
  IAMCodeDefinedEntity,
  IAMUserNode,
} from '@/types';
import { findAnyValidObjective } from '@/utils/iam-code-linter';

function createIAMNode<
  TLevelObjectiveID,
  TFinishEventMap extends BaseFinishEventMap,
  TNode extends IAMAnyNode,
  TEntity extends IAMCodeDefinedEntity,
  TObjectiveType extends ObjectiveType,
>(
  context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
  docString: string,
  label: string,
  entityType: TEntity,
  createNodeFunc: (overrides: {
    rootOverrides?: Partial<Omit<IAMAnyNode, 'data'>>;
    dataOverrides?: Partial<TNode['data']>;
  }) => TNode,
  targetValidObjective?: BaseCreationObjective<TFinishEventMap>,
  additionalDataOverrides: Partial<TNode['data']> = {}
): {
  updatedContext: GenericContext<TLevelObjectiveID, TFinishEventMap>;
  events: TFinishEventMap[TObjectiveType][];
  createdNode: TNode;
} {
  const sideEffectsEvents: TFinishEventMap[TObjectiveType][] = [];

  const newNode = createNodeFunc({
    dataOverrides: {
      id: targetValidObjective?.entity_id ?? _.uniqueId(`${entityType.toLowerCase()}-`),
      content: docString,
      label: label,
      unnecessary_node: targetValidObjective === undefined,
      initial_position: targetValidObjective?.created_node_initial_position ?? 'center',
      account_id: targetValidObjective?.account_id,
      entity: entityType,
      editable: false,
      parent_id: targetValidObjective?.created_node_parent_id,
      ...additionalDataOverrides,
    } satisfies Partial<TNode['data']>,
    rootOverrides: {
      parentId: targetValidObjective?.created_node_parent_id,
    },
  });

  let updatedContext = produce(context, draftContext => {
    draftContext.nodes.push(newNode as WritableDraft<IAMAnyNode>);

    if (targetValidObjective) {
      draftContext.policy_creation_objectives.find(
        objective => objective.id === targetValidObjective.id
      )!.finished = true;

      sideEffectsEvents.push(targetValidObjective.on_finish_event);
    }
  });

  const nodeById = _.keyBy(updatedContext.nodes, 'id');

  targetValidObjective?.initial_edges?.forEach(edge => {
    ({ updatedContext } = updateConnectionEdges(
      updatedContext,
      nodeById[edge.source],
      nodeById[edge.target],
      true,
      { data: edge.data }
    ));
  });

  return { updatedContext, events: sideEffectsEvents, createdNode: newNode };
}

export function createTrustPolicy<TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
  context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
  docString: string,
  label: string,
  accountId?: AccountID
): {
  updatedContext: GenericContext<TLevelObjectiveID, TFinishEventMap>;
  events: TFinishEventMap[ObjectiveType.ROLE_CREATION_OBJECTIVE][];
} {
  const targetValidObjective = findAnyValidObjective<IAMNodeEntity.Role>(
    context.policy_creation_objectives,
    context.nodes,
    docString,
    accountId,
    IAMNodeEntity.Role
  );

  return createIAMNode(
    context,
    docString,
    label,
    IAMNodeEntity.Role,
    createRoleNode,
    targetValidObjective
  );
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

  return createIAMNode(
    context,
    docString,
    label,
    IAMNodeEntity.Policy,
    createPolicyNode,
    targetValidObjective,
    { granted_accesses: targetValidObjective?.granted_accesses ?? [] }
  );
}

export function createResourcePolicy<TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
  context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
  docString: string,
  label: string,
  accountId?: AccountID
): {
  updatedContext: GenericContext<TLevelObjectiveID, TFinishEventMap>;
  events: TFinishEventMap[ObjectiveType.RESOURCE_POLICY_CREATION_OBJECTIVE][];
} {
  const targetValidObjective = findAnyValidObjective<IAMNodeEntity.ResourcePolicy>(
    context.resource_policy_creation_objectives!,
    context.nodes,
    docString,
    accountId,
    IAMNodeEntity.ResourcePolicy
  );

  const createNodeRes = createIAMNode(
    context,
    docString,
    label,
    IAMNodeEntity.ResourcePolicy,
    createPolicyNode,
    targetValidObjective
  );

  if (!targetValidObjective) return createNodeRes;

  const { updatedContext } = updateConnectionEdges(
    createNodeRes.updatedContext,
    createNodeRes.createdNode,
    createNodeRes.updatedContext.nodes.find(
      node => node.id === targetValidObjective.resource_node_id
    )!,
    true,
    {
      data: {
        source: createNodeRes.createdNode.id,
        target: targetValidObjective?.created_node_parent_id,
      },
    }
  );

  return {
    updatedContext,
    events: createNodeRes.events,
  };
}

export function createSCP<TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
  context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
  docString: string,
  label: string
): {
  updatedContext: GenericContext<TLevelObjectiveID, TFinishEventMap>;
  events: TFinishEventMap[ObjectiveType.SCP_CREATION_OBJECTIVE][];
} {
  const targetValidObjective = findAnyValidObjective<IAMNodeEntity.SCP>(
    context.policy_creation_objectives,
    context.nodes,
    docString,
    undefined,
    IAMNodeEntity.SCP
  );

  return createIAMNode(
    context,
    docString,
    label,
    IAMNodeEntity.SCP,
    createSCPNode,
    targetValidObjective,
    { blocked_edges: targetValidObjective?.blocked_accesses }
  );
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
        layout_group_id: targetObjective?.layout_group_id,
        unnecessary_node: targetObjective === undefined,
        ...props,
      },
      rootOverrides: {
        parentId: targetObjective?.created_node_parent_id,
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
