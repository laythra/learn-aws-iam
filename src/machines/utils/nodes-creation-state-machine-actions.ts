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
import { IAMAnyNode, IAMGroupNode, IAMNodeEntity, IAMScriptableEntity, IAMUserNode } from '@/types';
import { findAnyValidObjective } from '@/utils/iam-code-linter';

function createIAMNode<
  TLevelObjectiveID,
  TFinishEventMap extends BaseFinishEventMap,
  TNode extends IAMAnyNode,
  TEntity extends IAMScriptableEntity,
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
    } as Partial<TNode['data']>,
    rootOverrides: {
      parentId: targetValidObjective?.created_node_parent_id,
    },
  });

  let updatedContext = produce(context, draftContext => {
    draftContext.nodes.push(newNode as WritableDraft<IAMAnyNode>);
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
    context.all_policy_creation_objectives,
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
    context.all_policy_creation_objectives,
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
    targetValidObjective
  );
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
    context.all_policy_creation_objectives,
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
        initial_position: targetObjective?.initial_position ?? 'center',
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
