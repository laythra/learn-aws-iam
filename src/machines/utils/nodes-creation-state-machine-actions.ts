import { produce, WritableDraft } from 'immer';
import _ from 'lodash';

import { GetLevelValidateFunctions } from '../functions-registry';
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
import { createSCPNode } from '@/factories/nodes/scp-node-factory';
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
  IAMSCPNode,
  IAMCodeDefinedEntity,
} from '@/types';
import { findAnyValidObjective } from '@/utils/iam-code-linter';

type EntityToNode = {
  [IAMNodeEntity.Policy]: IAMPolicyNode;
  [IAMNodeEntity.ResourcePolicy]: IAMResourcePolicyNode;
  [IAMNodeEntity.PermissionBoundary]: IAMPermissionBoundaryNode;
  [IAMNodeEntity.SCP]: IAMSCPNode;
  [IAMNodeEntity.Role]: IAMRoleNode;
};

type NodeFor<E extends IAMCodeDefinedEntity> = EntityToNode[E];
type NodeDataFor<E extends IAMCodeDefinedEntity> = NodeFor<E>['data'];
type CreateNodeFn<E extends IAMCodeDefinedEntity> = (args: {
  dataOverrides?: Partial<NodeDataFor<E>>;
  rootOverrides?: Partial<Omit<IAMAnyNode, 'data'>>;
}) => NodeFor<E>;

const nodesCreationMap: { [E in IAMCodeDefinedEntity]: CreateNodeFn<E> } = {
  [IAMNodeEntity.Policy]: createPolicyNode,
  [IAMNodeEntity.ResourcePolicy]: createResourcePolicyNode,
  [IAMNodeEntity.PermissionBoundary]: createPermissionBoundaryNode,
  [IAMNodeEntity.SCP]: createSCPNode,
  [IAMNodeEntity.Role]: createRoleNode,
};

export function createNodeFromObjective<
  TFinishEventMap extends BaseFinishEventMap,
  E extends IAMCodeDefinedEntity,
>(
  docString: string,
  label: string,
  entityType: E,
  targetValidObjective?: BaseCreationObjective<TFinishEventMap>,
  accountId?: AccountID
): NodeFor<E> {
  const createNodeFn = nodesCreationMap[entityType];
  return createNodeFn({
    dataOverrides: {
      id: targetValidObjective?.id ?? _.uniqueId(`${entityType.toLowerCase()}-`),
      content: docString,
      label: label,
      unnecessary_node: targetValidObjective === undefined,
      account_id: targetValidObjective?.account_id ?? accountId,
      layout_group_id:
        targetValidObjective?.layout_group_id ?? CommonLayoutGroupID.CenterHorizontal,
      entity: entityType,
      editable: false,
      parent_id: targetValidObjective?.created_node_parent_id ?? accountId,
      ...targetValidObjective?.extra_data,
      show_pulse_animation: targetValidObjective !== undefined,
    } as NodeDataFor<E>,
    rootOverrides: {
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
  accountId?: AccountID
): {
  updatedContext: GenericContext<TLevelObjectiveID, TFinishEventMap>;
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
