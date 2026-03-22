import { produce, WritableDraft } from 'immer';
import _ from 'lodash';

import { GenericContext } from '../../types/context-types';
import { findAnyValidObjective } from '@/domain/iam-policy-validator';
import { createGroupNode } from '@/domain/nodes/group-node-factory';
import { createIdentityPolicyNode } from '@/domain/nodes/identity-policy-node-factory';
import { createPermissionBoundaryNode } from '@/domain/nodes/permission-boundary-node-factory';
import { createResourcePolicyNode } from '@/domain/nodes/resource-policy-node-factory';
import { createRoleNode } from '@/domain/nodes/role-node-factory';
import { createSCPNode } from '@/domain/nodes/scp-node-factory';
import { createUserNode } from '@/domain/nodes/user-node-factory';
import { GetLevelValidateFunctions } from '@/runtime/functions-registry';
import { IAMNodeEntity, CommonLayoutGroupID, IAMCodeDefinedEntity } from '@/types/iam-enums';
import { IAMNodeDataOverrides } from '@/types/iam-node-data-types';
import {
  IAMAnyNode,
  IAMGroupNode,
  IAMUserNode,
  IAMCodeDefinedNode,
  IAMRoleNode,
  IAMIdentityPolicyNode,
  IAMResourcePolicyNode,
  IAMPermissionBoundaryNode,
  IAMSCPNode,
} from '@/types/iam-node-types';
import { BaseCreationObjective, BaseFinishEventMap, ObjectiveType } from '@/types/objective-types';

type EntityToNode = {
  [IAMNodeEntity.IdentityPolicy]: IAMIdentityPolicyNode;
  [IAMNodeEntity.ResourcePolicy]: IAMResourcePolicyNode;
  [IAMNodeEntity.PermissionBoundary]: IAMPermissionBoundaryNode;
  [IAMNodeEntity.SCP]: IAMSCPNode;
  [IAMNodeEntity.Role]: IAMRoleNode;
};

type NodeFor<E extends IAMCodeDefinedEntity> = EntityToNode[E];
type NodeDataFor<E extends IAMCodeDefinedEntity> = NodeFor<E>['data'];
type CreateNodeFn<E extends IAMCodeDefinedEntity> = (args: {
  dataOverrides?: IAMNodeDataOverrides<NodeDataFor<E>>;
  rootOverrides?: Partial<Omit<IAMAnyNode, 'data'>>;
}) => NodeFor<E>;

const nodesCreationMap: { [E in IAMCodeDefinedEntity]: CreateNodeFn<E> } = {
  [IAMNodeEntity.IdentityPolicy]: createIdentityPolicyNode,
  [IAMNodeEntity.ResourcePolicy]: createResourcePolicyNode,
  [IAMNodeEntity.PermissionBoundary]: createPermissionBoundaryNode,
  [IAMNodeEntity.SCP]: createSCPNode,
  [IAMNodeEntity.Role]: createRoleNode,
};

function createNodeFromObjective<
  TFinishEventMap extends BaseFinishEventMap,
  E extends IAMCodeDefinedEntity,
>(
  docString: string,
  label: string,
  entityType: E,
  targetValidObjective?: BaseCreationObjective<TFinishEventMap>,
  accountId?: string
): NodeFor<E> {
  const createNodeFn = nodesCreationMap[entityType];
  return createNodeFn({
    dataOverrides: {
      content: docString,
      label: label,
      unnecessary_node: targetValidObjective === undefined,
      account_id: targetValidObjective?.account_id ?? accountId,
      layout_group_id:
        targetValidObjective?.layout_group_id ?? CommonLayoutGroupID.CenterHorizontal,
      entity: entityType,
      editable: false,
      parent_id: targetValidObjective?.created_node_parent_id ?? accountId,
      node_tooltip: targetValidObjective?.node_tooltip,
      ...targetValidObjective?.extra_data,
    } as NodeDataFor<E>,
    rootOverrides: {
      id: targetValidObjective?.id ?? _.uniqueId(`${entityType.toLowerCase()}-`),
      parentId: targetValidObjective?.created_node_parent_id ?? accountId,
    },
  });
}

export function createIAMNode<
  TLevelObjectiveID,
  TFinishEventMap extends BaseFinishEventMap,
  TNode extends IAMCodeDefinedNode,
>(
  context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
  docString: string,
  label: string,
  nodeEntity: TNode['data']['entity'],
  accountId?: string
): {
  updatedContext: GenericContext<TLevelObjectiveID, TFinishEventMap>;
  edgesToCreate: { from: string; to: string }[];
  createdNode: TNode;
  events: string[];
} {
  const validateFunctions = GetLevelValidateFunctions(context.level_number);
  const targetValidObjective = findAnyValidObjective(
    context.policy_creation_objectives,
    validateFunctions,
    context.nodes,
    docString,
    accountId,
    nodeEntity
  );

  const newNode = createNodeFromObjective(
    docString,
    label,
    nodeEntity,
    targetValidObjective,
    accountId
  );

  const updatedContext = produce(context, draftContext => {
    if (targetValidObjective) {
      draftContext.policy_creation_objectives.find(
        objective => objective.id === targetValidObjective?.id
      )!.finished = true;
    }

    draftContext.nodes.push(newNode as WritableDraft<IAMCodeDefinedNode>);
  });

  return {
    updatedContext,
    events: targetValidObjective ? [targetValidObjective.on_finish_event] : [],
    edgesToCreate: targetValidObjective?.initial_edges ?? [],
    createdNode: newNode as unknown as TNode,
  };
}

export function createUserGroupNode<TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
  context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
  nodeType: IAMNodeEntity.Group | IAMNodeEntity.User,
  props:
    | Omit<IAMNodeDataOverrides<IAMGroupNode['data']>, 'entity'>
    | Omit<IAMNodeDataOverrides<IAMUserNode['data']>, 'entity'>
): {
  updatedContext: GenericContext<TLevelObjectiveID, TFinishEventMap>;
  events: TFinishEventMap[ObjectiveType.IAM_USER_GROUP_CREATION_OBJECTIVE][];
  createdNode: IAMGroupNode | IAMUserNode;
} {
  const targetObjective = context.user_group_creation_objectives.find(
    objective => objective.entity_to_create === nodeType && !objective.finished
  );

  const creationFunc = nodeType === IAMNodeEntity.Group ? createGroupNode : createUserNode;
  const createdNode = creationFunc({
    dataOverrides: {
      id: targetObjective?.entity_id ?? _.uniqueId('node_'),
      layout_group_id: targetObjective?.layout_group_id ?? CommonLayoutGroupID.TopLeftVertical,
      unnecessary_node: targetObjective === undefined,
      node_tooltip: targetObjective?.node_tooltip,
      ...props,
    },
    rootOverrides: {
      parentId: targetObjective?.created_node_parent_id,
    },
  });

  const events: TFinishEventMap[ObjectiveType.IAM_USER_GROUP_CREATION_OBJECTIVE][] = targetObjective
    ? [targetObjective.on_finish_event]
    : [];

  const updatedContext = produce(context, draftContext => {
    draftContext.nodes.push(createdNode as WritableDraft<IAMGroupNode | IAMUserNode>);
    if (targetObjective) {
      draftContext.user_group_creation_objectives.find(
        objective => objective.entity_to_create === nodeType && !objective.finished
      )!.finished = true;
    }
  });

  return {
    updatedContext,
    events,
    createdNode,
  };
}
