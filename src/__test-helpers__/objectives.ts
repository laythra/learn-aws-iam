import _ from 'lodash';

import { MANAGED_POLICIES } from '@/levels/consts';
import {
  BaseFinishEventMap,
  IAMIdentityPolicyCreationObjective,
  IAMUserGroupCreationObjective,
  ObjectiveType,
} from '@/levels/types/objective-types';
import { createPolicyCreationObjective } from '@/levels/utils/factories/identity-policy-creation-objective-factory';
import { IAMNodeEntity } from '@/types/iam-enums';

export function createMockPolicyCreationObjective<TFinishEventMap extends BaseFinishEventMap>(
  overrides: Partial<IAMIdentityPolicyCreationObjective<TFinishEventMap>> = {}
): IAMIdentityPolicyCreationObjective<BaseFinishEventMap> {
  return createPolicyCreationObjective({
    id: _.uniqueId('mock-policy-creation-objective-'),
    entity: IAMNodeEntity.IdentityPolicy,
    type: ObjectiveType.POLICY_CREATION_OBJECTIVE,
    initial_code: MANAGED_POLICIES.EmptyPolicy,
    finished: false,
    on_finish_event: 'MOCK_FINISH_EVENT',
    extra_data: {
      granted_accesses: [],
    },
    ...overrides,
  } satisfies IAMIdentityPolicyCreationObjective<TFinishEventMap>);
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
