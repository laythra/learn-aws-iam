import { produce, WritableDraft } from 'immer';
import _ from 'lodash';

import { updateConnectionEdges } from './edges-creation-state-machine-actions';
import { IAMNodeFilter } from './iam-node-filter';
import {
  AccountID,
  BaseCreationObjective,
  BaseFinishEventMap,
  GenericContext,
  ObjectiveType,
} from '../types';
import { createGroupNode } from '@/factories/nodes/group-node-factory';
import { createPermissionBoundaryNode } from '@/factories/nodes/permission-boundary-node-factory';
import { createPolicyNode } from '@/factories/nodes/policy-node-factory';
import { createResourcePolicyNode } from '@/factories/nodes/resource-policy-node-factory';
import { createRoleNode } from '@/factories/nodes/role-node-factory';
import { createUserNode } from '@/factories/nodes/user-node-factory';
import {
  IAMAnyNode,
  IAMGroupNode,
  IAMNodeEntity,
  IAMUserNode,
  CommonLayoutGroupID,
  IAMCodeDefinedNode,
  IAMRoleNode,
  IAMPolicyNode,
  IAMResourcePolicyNode,
  IAMPermissionBoundaryNode,
} from '@/types';
import { findAnyValidObjective } from '@/utils/iam-code-linter';

function createNodeFromObjective<
  TFinishEventMap extends BaseFinishEventMap,
  TNode extends IAMCodeDefinedNode,
>(
  docString: string,
  label: string,
  entityType: TNode['data']['entity'],
  additionalDataOverrides: Partial<TNode['data']> = {},
  createNodeFn: (overrides: {
    rootOverrides?: Partial<Omit<IAMAnyNode, 'data'>>;
    dataOverrides?: Partial<TNode['data']>;
  }) => TNode,
  targetValidObjective?: BaseCreationObjective<TFinishEventMap>
): TNode {
  return createNodeFn({
    dataOverrides: {
      id: targetValidObjective?.entity_id ?? _.uniqueId(`${entityType.toLowerCase()}-`),
      content: docString,
      label: label,
      unnecessary_node: targetValidObjective === undefined,
      account_id: targetValidObjective?.account_id,
      layout_group_id:
        targetValidObjective?.layout_group_id ?? CommonLayoutGroupID.CenterHorizontal,
      entity: entityType,
      editable: false,
      parent_id: targetValidObjective?.created_node_parent_id,
      ...additionalDataOverrides,
    } satisfies Partial<TNode['data']>,
    rootOverrides: {
      parentId: targetValidObjective?.created_node_parent_id,
    },
  });
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
    context.role_creation_objectives,
    context.nodes,
    docString,
    accountId,
    IAMNodeEntity.Role
  );

  const newNode = createNodeFromObjective<TFinishEventMap, IAMRoleNode>(
    docString,
    label,
    IAMNodeEntity.Role,
    {},
    createRoleNode,
    targetValidObjective
  );

  const updatedContext = produce(context, draftContext => {
    draftContext.role_creation_objectives.find(
      objective => objective.id === targetValidObjective?.id
    )!.finished = true;

    draftContext.nodes.push(newNode as WritableDraft<IAMRoleNode>);
  });

  return {
    updatedContext,
    events: targetValidObjective ? [targetValidObjective.on_finish_event] : [],
  };
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

  const newNode = createNodeFromObjective<TFinishEventMap, IAMPolicyNode>(
    docString,
    label,
    IAMNodeEntity.Policy,
    { granted_accesses: targetValidObjective?.granted_accesses ?? [] },
    createPolicyNode,
    targetValidObjective
  );

  const updatedContext = produce(context, draftContext => {
    if (targetValidObjective) {
      draftContext.policy_creation_objectives.find(
        objective => objective.id === targetValidObjective?.id
      )!.finished = true;
    }

    draftContext.nodes.push(newNode as WritableDraft<IAMPolicyNode>);
  });

  return {
    updatedContext,
    events: targetValidObjective ? [targetValidObjective.on_finish_event] : [],
  };
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
    context.resource_policy_creation_objectives ?? [],
    context.nodes,
    docString,
    accountId,
    IAMNodeEntity.ResourcePolicy
  );

  const newNode = createNodeFromObjective<TFinishEventMap, IAMResourcePolicyNode>(
    docString,
    label,
    IAMNodeEntity.ResourcePolicy,
    {},
    createResourcePolicyNode,
    targetValidObjective
  );

  let updatedContext = produce(context, draftContext => {
    if (targetValidObjective) {
      (draftContext.resource_policy_creation_objectives ?? []).find(
        objective => objective.id === targetValidObjective?.id
      )!.finished = true;
    }
    draftContext.nodes.push(newNode as WritableDraft<IAMResourcePolicyNode>);
  });

  const resourceNode = IAMNodeFilter.create()
    .fromNodes(context.nodes)
    .whereIdIs(newNode.data.resource_node_id)
    .whereEntityIs(IAMNodeEntity.Resource)
    .build()[0];

  ({ updatedContext } = updateConnectionEdges(context, newNode, resourceNode, true, {
    data: {
      source: newNode.id,
      target: targetValidObjective?.created_node_parent_id,
    },
  }));

  return {
    updatedContext,
    events: targetValidObjective ? [targetValidObjective.on_finish_event] : [],
  };
}

// TODO: Add support for SCP creation objectives
export function createSCP<TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
  context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
  docString: string,
  label: string
): {
  updatedContext: GenericContext<TLevelObjectiveID, TFinishEventMap>;
  events: TFinishEventMap[ObjectiveType.SCP_CREATION_OBJECTIVE][];
} {
  findAnyValidObjective<IAMNodeEntity.SCP>(
    context.policy_creation_objectives,
    context.nodes,
    docString + label,
    undefined,
    IAMNodeEntity.SCP
  );

  return {
    updatedContext: context,
    events: [],
  };
}

export function createPermissionBoundary<
  TLevelObjectiveID,
  TFinishEventMap extends BaseFinishEventMap,
>(
  context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
  docString: string,
  label: string,
  accountId?: AccountID
): {
  updatedContext: GenericContext<TLevelObjectiveID, TFinishEventMap>;
  events: TFinishEventMap[ObjectiveType.PERMISSION_BOUNDARY_CREATION_OBJECTIVE][];
} {
  const targetValidObjective = findAnyValidObjective<IAMNodeEntity.PermissionBoundary>(
    context.permission_boundary_creation_objectives ?? [],
    context.nodes,
    docString,
    accountId,
    IAMNodeEntity.PermissionBoundary
  );

  const newNode = createNodeFromObjective<TFinishEventMap, IAMPermissionBoundaryNode>(
    docString,
    label,
    IAMNodeEntity.PermissionBoundary,
    { is_edge_blocked: targetValidObjective?.is_edge_blocked },
    createPermissionBoundaryNode,
    targetValidObjective
  );

  const updatedContext = produce(context, draftContext => {
    if (targetValidObjective) {
      (draftContext.permission_boundary_creation_objectives ?? []).find(
        objective => objective.id === targetValidObjective?.id
      )!.finished = true;
    }
    draftContext.nodes.push(newNode as WritableDraft<IAMPermissionBoundaryNode>);
  });

  return {
    updatedContext,
    events: targetValidObjective ? [targetValidObjective.on_finish_event] : [],
  };
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
