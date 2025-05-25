import { FinishEventMap } from '../types/finish-event-enums';
import {
  createRoleCreationObjective,
  RoleCreationObjectiveInput,
} from '@/factories/objectives-factory';
import { IAMRoleCreationObjective } from '@/machines/types';
export const CALLOUT_MESSAGE1 = `
  The \`Principal\` part in the trust policy defines the entity that is allowed to assume the role.

  * \`{ "AWS": "<user_arn>" }\` defines an **IAM User** Principal.
  * \`{ "Service": "<service-name>.amazonaws.com" }\` defines an **AWS Service** Principal.
`;

export const ROLE_CREATION_OBJECTIVES_RAW_DATA: RoleCreationObjectiveInput<FinishEventMap>[][] = [];

export const ROLE_CREATION_OBJECTIVES: IAMRoleCreationObjective<FinishEventMap>[][] =
  ROLE_CREATION_OBJECTIVES_RAW_DATA.map(objectives => objectives.map(createRoleCreationObjective));
