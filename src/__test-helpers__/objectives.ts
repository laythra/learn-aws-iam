import _ from 'lodash';

import { createPolicyCreationObjective } from '@/factories/nodes_creation_objectives/policy-creation-objective-factory';
import { MANAGED_POLICIES } from '@/machines/consts';
import {
  BaseFinishEventMap,
  IAMPolicyCreationObjective,
  IAMUserGroupCreationObjective,
  ObjectiveType,
} from '@/machines/types';
import { IAMNodeEntity } from '@/types';

export function createMockPolicyCreationObjective<TFinishEventMap extends BaseFinishEventMap>(
  overrides: Partial<IAMPolicyCreationObjective<TFinishEventMap>> = {}
): IAMPolicyCreationObjective<BaseFinishEventMap> {
  return createPolicyCreationObjective({
    id: _.uniqueId('mock-policy-creation-objective-'),
    entity: IAMNodeEntity.Policy,
    type: ObjectiveType.POLICY_CREATION_OBJECTIVE,
    initial_code: MANAGED_POLICIES.EmptyPolicy,
    finished: false,
    on_finish_event: 'MOCK_FINISH_EVENT',
    extra_data: {
      granted_accesses: [],
    },
    ...overrides,
  } satisfies IAMPolicyCreationObjective<TFinishEventMap>);
}

export function createMockUserGroupCreationObjective<TFinishEventMap extends BaseFinishEventMap>(
  overrides: Partial<IAMUserGroupCreationObjective<TFinishEventMap>>,
  entityToCreate: IAMNodeEntity.User | IAMNodeEntity.Group = IAMNodeEntity.User
): IAMUserGroupCreationObjective<BaseFinishEventMap> {
  return {
    entity_id: 'mock-user-group-id',
    type: ObjectiveType.IAM_USER_GROUP_CREATION_OBJECTIVE,
    finished: false,
    entity_to_create: entityToCreate,
    on_finish_event: 'MOCK_USER_GROUP_FINISH_EVENT',
    ...overrides,
  };
}
