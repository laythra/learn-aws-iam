import _ from 'lodash';

import { MANAGED_POLICIES } from '@/machines/config';
import {
  BaseFinishEventMap,
  IAMPermissionBoundaryCreationObjective,
  IAMPolicyCreationObjective,
  IAMResourcePolicyCreationObjective,
  IAMRoleCreationObjective,
  IAMSCPCreationObjective,
  IAMUserGroupCreationObjective,
  ObjectiveType,
} from '@/machines/types';
import trustPolicySchema from '@/schemas/aws-iam-role-trust-policy-schema.json';
import { IAMNodeEntity } from '@/types';
import { PartialWithRequired } from '@/types/common';

export type RoleCreationObjectiveInput<TFinishEventMap extends BaseFinishEventMap> = Partial<
  Omit<IAMRoleCreationObjective<TFinishEventMap>, 'id' | 'finished' | 'type' | 'entity'>
>;

export type PolicyCreationObjectiveInput<TFinishEventMap extends BaseFinishEventMap> = Partial<
  Omit<IAMPolicyCreationObjective<TFinishEventMap>, 'id' | 'finished' | 'type' | 'entity'>
>;

export type SCPCreationObjectiveInput<TFinishEventMap extends BaseFinishEventMap> = Partial<
  Omit<IAMSCPCreationObjective<TFinishEventMap>, 'id' | 'finished' | 'type' | 'entity'>
>;

export type PermissionBoundaryCreationObjectiveInput<TFinishEventMap extends BaseFinishEventMap> =
  Partial<
    Omit<
      IAMPermissionBoundaryCreationObjective<TFinishEventMap>,
      'id' | 'finished' | 'type' | 'entity'
    >
  >;

export type UserGroupCreationObjectiveInput<TFinishEventMap extends BaseFinishEventMap> = Partial<
  Omit<IAMUserGroupCreationObjective<TFinishEventMap>, 'id' | 'finished' | 'type' | 'entity'>
>;

export type ResourcePolicyCreationObjectiveInput<TFinishEventMap extends BaseFinishEventMap> =
  PartialWithRequired<
    Omit<
      IAMResourcePolicyCreationObjective<TFinishEventMap>,
      'id' | 'finished' | 'type' | 'entity'
    >,
    'resource_node_id'
  >;

function getTemplateRoleCreationObjectiveAttributes<
  TFinishEventMap extends BaseFinishEventMap,
>(): Omit<IAMRoleCreationObjective<TFinishEventMap>, 'id' | 'finished' | 'type' | 'entity'> {
  return {
    required_policies: [],
    required_principles: [],
    entity_id: '-',
    json_schema: trustPolicySchema,
    initial_code: MANAGED_POLICIES.EmptyTrustPolicy,
    on_finish_event: '',
    validate_inside_code_editor: true,
    initial_edges: [],
  };
}

function getTemplatePolicyCreationObjectiveAttributes<
  TFinishEventMap extends BaseFinishEventMap,
>(): Omit<IAMPolicyCreationObjective<TFinishEventMap>, 'id' | 'finished' | 'type' | 'entity'> {
  return {
    entity_id: '-',
    json_schema: trustPolicySchema,
    initial_code: MANAGED_POLICIES.EmptyPermissionPolicy,
    on_finish_event: '',
    validate_inside_code_editor: true,
    granted_accesses: [],
    initial_edges: [],
  };
}

const IAM_USER_GROUP_CREATION_OBJECTIVE_TEMPLATE: Omit<
  IAMUserGroupCreationObjective<BaseFinishEventMap>,
  'id' | 'finished' | 'type'
> = {
  entity_id: '-',
  entity_to_create: IAMNodeEntity.User,
  initial_position: 'left-center',
  on_finish_event: '',
};

export function createRoleCreationObjective<TFinishEventMap extends BaseFinishEventMap>(
  props: RoleCreationObjectiveInput<TFinishEventMap>
): IAMRoleCreationObjective<TFinishEventMap> {
  return {
    finished: false,
    id: _.uniqueId(`role-creation-objective-`),
    type: ObjectiveType.ROLE_CREATION_OBJECTIVE,
    entity: IAMNodeEntity.Role,
    ...getTemplateRoleCreationObjectiveAttributes(),
    ...props,
  };
}

export function createPolicyCreationObjective<TFinishEventMap extends BaseFinishEventMap>(
  props: PolicyCreationObjectiveInput<TFinishEventMap>
): IAMPolicyCreationObjective<TFinishEventMap> {
  return {
    finished: false,
    id: _.uniqueId(`policy-creation-objective-`),
    type: ObjectiveType.POLICY_CREATION_OBJECTIVE,
    entity: IAMNodeEntity.Policy,
    ...getTemplatePolicyCreationObjectiveAttributes(),
    ...props,
  };
}

export function createUserGroupCreationObjective<TFinishEventMap extends BaseFinishEventMap>(
  props: UserGroupCreationObjectiveInput<TFinishEventMap>
): IAMUserGroupCreationObjective<TFinishEventMap> {
  return {
    finished: false,
    type: ObjectiveType.IAM_USER_GROUP_CREATION_OBJECTIVE,
    ...IAM_USER_GROUP_CREATION_OBJECTIVE_TEMPLATE,
    ...props,
  };
}

export function createResourcePolicyCreationObjective<TFinishEventMap extends BaseFinishEventMap>(
  props: ResourcePolicyCreationObjectiveInput<TFinishEventMap>
): IAMResourcePolicyCreationObjective<TFinishEventMap> {
  return {
    finished: false,
    id: _.uniqueId(`resource-policy-creation-objective-`),
    type: ObjectiveType.RESOURCE_POLICY_CREATION_OBJECTIVE,
    entity: IAMNodeEntity.ResourcePolicy,
    ...getTemplatePolicyCreationObjectiveAttributes(),
    ...props,
  };
}
