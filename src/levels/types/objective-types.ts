import type { Edge } from '@xyflow/react';

import { IAMNodeEntity } from '@/types/iam-enums';
import { AccessLevel, CreatableIAMNodeEntity, IAMCodeDefinedEntity } from '@/types/iam-enums';
import { PolicyGrantedAccess } from '@/types/iam-policy-types';

export type HelpBadge = {
  path: string;
  content: string;
  color: string;
};

export enum ObjectiveType {
  POLICY_CREATION_OBJECTIVE = 'POLICY_CREATION_OBJECTIVE',
  RESOURCE_POLICY_CREATION_OBJECTIVE = 'RESOURCE_POLICY_CREATION_OBJECTIVE',
  SCP_CREATION_OBJECTIVE = 'SCP_CREATION_OBJECTIVE',
  POLICY_EDIT_OBJECTIVE = 'POLICY_EDIT_OBJECTIVE',
  TRUST_POLICY_EDIT_OBJECTIVE = 'TRUST_POLICY_EDIT_OBJECTIVE',
  ROLE_CREATION_OBJECTIVE = 'ROLE_CREATION_OBJECTIVE',
  IAM_USER_GROUP_CREATION_OBJECTIVE = 'IAM_USER_GROUP_CREATION_OBJECTIVE',
  EDGE_CONNECTION_OBJECTIVE = 'EDGE_CONNECTION_OBJECTIVE',
  LEVEL_OBJECTIVE = 'LEVEL_OBJECTIVE',
  PERMISSION_BOUNDARY_CREATION_OBJECTIVE = 'PERMISSION_BOUNDARY_CREATION_OBJECTIVE',
}

export type BaseFinishEventMap = Record<ObjectiveType, string>;
export type FinishEventMapWithDefaults<T extends Partial<Record<ObjectiveType, string>>> = {
  [K in ObjectiveType]: K extends keyof T ? T[K] : never;
};

export type LevelObjective<TObjectiveID, TFinishEventMap extends BaseFinishEventMap> = {
  type: ObjectiveType.LEVEL_OBJECTIVE;
  id: TObjectiveID;
  label: string;
  finished: boolean;
  on_finish_event?: TFinishEventMap[ObjectiveType.LEVEL_OBJECTIVE];
  hint_text?: string;
};

export type EdgeConnectionObjective<TFinishEventMap extends BaseFinishEventMap> = {
  readonly type: ObjectiveType.EDGE_CONNECTION_OBJECTIVE;
  readonly required_edges: Edge[];
  readonly on_finish_event: TFinishEventMap[ObjectiveType.EDGE_CONNECTION_OBJECTIVE];
  readonly is_finished: boolean;
  readonly established_edge_hovering_label: AccessLevel | string;
  readonly established_edge_target_handle?: string;
  readonly established_edge_source_handle?: string;
  is_edge_creation_blocked?: boolean;
};

export interface BaseCreationObjective<TFinishEventMap extends BaseFinishEventMap> {
  /**
   * Unique identifier for the objective.
   * This ID is used as the node ID upon creation and as the objective's identifier in the state machine context.
   */
  readonly id: string;
  readonly entity: unknown;
  readonly type: ObjectiveType;
  readonly initial_code: object;
  readonly on_finish_event:
    | TFinishEventMap[ObjectiveType.POLICY_CREATION_OBJECTIVE]
    | TFinishEventMap[ObjectiveType.SCP_CREATION_OBJECTIVE]
    | TFinishEventMap[ObjectiveType.ROLE_CREATION_OBJECTIVE]
    | TFinishEventMap[ObjectiveType.RESOURCE_POLICY_CREATION_OBJECTIVE]
    | TFinishEventMap[ObjectiveType.PERMISSION_BOUNDARY_CREATION_OBJECTIVE];
  readonly help_badges?: HelpBadge[];
  readonly limit_new_lines?: boolean;
  readonly initial_position?: string;
  readonly account_id?: string;
  readonly created_node_initial_position?: string;
  readonly callout_message?: string;
  readonly hint_messages?: { title: string; content: string }[];
  readonly created_node_parent_id?: string;
  readonly layout_group_id?: string;
  readonly initial_edges?: {
    from: string;
    to: string;
  }[];
  finished: boolean;
  /**
   * Extra data overridable by each objective type
   */
  extra_data: Record<string, unknown>;
  /**
   * Optional alert messages to show on the created node.
   */
  alert_message?: string;
}

export interface IAMPermissionPolicyCreationObjective<
  TFinishEventMap extends BaseFinishEventMap,
  TApplicableNodesFnName extends string = string,
> extends BaseCreationObjective<TFinishEventMap> {
  readonly entity: IAMNodeEntity.Policy;
  readonly type: ObjectiveType.POLICY_CREATION_OBJECTIVE;
  readonly on_finish_event: TFinishEventMap[ObjectiveType.POLICY_CREATION_OBJECTIVE];
  readonly extra_data: {
    granted_accesses: PolicyGrantedAccess<TApplicableNodesFnName>[];
  };
}

export interface IAMResourcePolicyCreationObjective<
  TFinishEventMap extends BaseFinishEventMap,
  TApplicableNodesFnName extends string = string,
> extends BaseCreationObjective<TFinishEventMap> {
  readonly entity: IAMNodeEntity.ResourcePolicy;
  readonly type: ObjectiveType.RESOURCE_POLICY_CREATION_OBJECTIVE;
  readonly on_finish_event: TFinishEventMap[ObjectiveType.RESOURCE_POLICY_CREATION_OBJECTIVE];
  readonly extra_data: {
    readonly resource_node_id: string;
    readonly granted_accesses?: PolicyGrantedAccess<TApplicableNodesFnName>[];
  };
}

export interface IAMSCPCreationObjective<
  TFinishEventMap extends BaseFinishEventMap,
  TIsEdgeBlockedFnName extends string = string,
> extends BaseCreationObjective<TFinishEventMap> {
  readonly type: ObjectiveType.SCP_CREATION_OBJECTIVE;
  readonly on_finish_event: TFinishEventMap[ObjectiveType.SCP_CREATION_OBJECTIVE];
  readonly entity: IAMNodeEntity.SCP;
  readonly extra_data: {
    readonly is_edge_blocked_fn_name: TIsEdgeBlockedFnName;
    readonly blocked_edge_content: string;
  };
}

export interface IAMPermissionBoundaryCreationObjective<
  TFinishEventMap extends BaseFinishEventMap,
  TIsEdgeBlockedFnName extends string = string,
> extends BaseCreationObjective<TFinishEventMap> {
  readonly type: ObjectiveType.PERMISSION_BOUNDARY_CREATION_OBJECTIVE;
  readonly on_finish_event: TFinishEventMap[ObjectiveType.PERMISSION_BOUNDARY_CREATION_OBJECTIVE];
  readonly entity: IAMNodeEntity.PermissionBoundary;
  readonly extra_data: {
    readonly is_edge_blocked_fn_name: TIsEdgeBlockedFnName;
    readonly blocked_edge_content: string;
  };
}

export interface IAMRoleCreationObjective<
  TFinishEventMap extends BaseFinishEventMap,
> extends BaseCreationObjective<TFinishEventMap> {
  readonly type: ObjectiveType.ROLE_CREATION_OBJECTIVE;
  readonly on_finish_event: TFinishEventMap[ObjectiveType.ROLE_CREATION_OBJECTIVE];
  readonly entity: IAMNodeEntity.Role;
  readonly extra_data: {
    readonly required_policies: string[];
    readonly required_principles: string[];
  };
}

export interface IAMPolicyEditObjective<
  TFinishEventMap extends BaseFinishEventMap,
  TValidateFn = string,
> {
  readonly id: string;
  /**
   * Unique identifier for the objective.
   * In creation objectives, the ID of the objective itself is sufficient to identify the validate function to use.
   * In edit objectives, we use `validate_fn_name` since we can have multiple edit objectives for the same node.
   */
  readonly validate_fn_name: TValidateFn;
  readonly type: ObjectiveType.POLICY_EDIT_OBJECTIVE;
  readonly entity: IAMCodeDefinedEntity;
  readonly allow_new_lines?: boolean;

  /**
   * Optional callout_message for the IAM Policy/Role Edit Objective.
   * Used to help the user understand what they need to do when editing the IAM Policy/Role.
   */
  readonly callout_message?: string;

  readonly on_finish_event: TFinishEventMap[ObjectiveType.POLICY_EDIT_OBJECTIVE];

  /**
   * Resources to grant to the users/groups associated with the IAM Policy/Role.
   */
  readonly resources_to_grant: PolicyGrantedAccess[];

  readonly help_badges?: HelpBadge[];
  readonly limit_new_lines?: boolean;
  readonly hint_messages?: { title: string; content: string }[];
  finished: boolean;
}

export interface IAMTrustPolicyEditObjective<TFinishEventMap extends BaseFinishEventMap> {
  readonly id: string;
  readonly type: ObjectiveType.TRUST_POLICY_EDIT_OBJECTIVE;
  readonly entity: IAMNodeEntity.Role;
  readonly allow_new_lines?: boolean;

  /**
   * Optional description for the IAM Policy/Role Edit Objective.
   * Used to help the user understand what they need to do when editing the IAM Policy/Role.
   */
  readonly description?: string;

  readonly on_finish_event: TFinishEventMap[ObjectiveType.TRUST_POLICY_EDIT_OBJECTIVE];
  readonly help_badges?: HelpBadge[];
  readonly limit_new_lines?: boolean;
}

export type IAMUserGroupCreationObjective<TFinishEventMap extends BaseFinishEventMap> = {
  readonly entity_id: string;
  readonly type: ObjectiveType.IAM_USER_GROUP_CREATION_OBJECTIVE;
  readonly on_finish_event: TFinishEventMap[ObjectiveType.IAM_USER_GROUP_CREATION_OBJECTIVE];
  readonly entity_to_create: CreatableIAMNodeEntity;
  readonly initial_position?: string;
  readonly created_node_parent_id?: string;
  readonly layout_group_id?: string;
  readonly alert_message?: string;
  finished: boolean;
};
