import _ from 'lodash';

import { MANAGED_POLICIES } from '@/machines/config';
import {
  BaseFinishEventMap,
  IAMPolicyCreationObjective,
  IAMRoleCreationObjective,
  ObjectiveType,
} from '@/machines/types';
import trustPolicySchema from '@/schemas/aws-iam-role-trust-policy-schema.json';
import { IAMNodeEntity } from '@/types';

function getTemplateRoleCreationObjectiveAttributes<
  TFinishEventMap extends BaseFinishEventMap,
>(): Omit<IAMRoleCreationObjective<TFinishEventMap>, 'id' | 'finished' | 'type' | 'entity'> {
  return {
    required_policies: [],
    required_principles: [],
    entity_id: '-',
    json_schema: trustPolicySchema,
    initial_code: MANAGED_POLICIES.EmptyPolicy,
    on_finish_event: '',
    validate_inside_code_editor: true,
  };
}

function getTemplatePolicyCreationObjectiveAttributes<
  TFinishEventMap extends BaseFinishEventMap,
>(): Omit<IAMPolicyCreationObjective<TFinishEventMap>, 'id' | 'finished' | 'type' | 'entity'> {
  return {
    entity_id: '-',
    json_schema: trustPolicySchema,
    initial_code: MANAGED_POLICIES.EmptyPolicy,
    on_finish_event: '',
    validate_inside_code_editor: true,
    granted_accesses: [],
  };
}

export function createRoleCreationObjective<TFinishEventMap extends BaseFinishEventMap>(
  props: Omit<IAMRoleCreationObjective<TFinishEventMap>, 'finished' | 'id' | 'type' | 'entity'>
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
  props: Omit<IAMPolicyCreationObjective<TFinishEventMap>, 'finished' | 'id' | 'type' | 'entity'>
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
