import { AccessLevel } from './iam-enums';

export interface PolicyGrantedAccess<TApplicableNodesFnName extends string = string> {
  readonly target_node: string;
  readonly access_level: AccessLevel;
  readonly source_handle?: string;
  readonly target_handle: string;
  readonly applicable_nodes_fn_name?: TApplicableNodesFnName;
}

export interface PolicyBlockedAccess {
  readonly target_handle: string;
  readonly source_handle?: string;
  readonly access_level: AccessLevel;
  readonly target_node: string;
}
