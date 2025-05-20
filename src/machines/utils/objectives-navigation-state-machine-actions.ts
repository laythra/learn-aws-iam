import { produce } from 'immer';

import { BaseFinishEventMap, GenericContext } from '../types';
import { IAMCodeDefinedEntity } from '@/types';

export function updatePolicyRoleCreationObjectivesList<
  TLevelObjectiveID,
  TFinishEventMap extends BaseFinishEventMap,
>(
  context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
  objective_entity: IAMCodeDefinedEntity
): { updatedContext: GenericContext<TLevelObjectiveID, TFinishEventMap> } {
  const updatedContext = produce(context, draftContext => {
    const entityObjectives = draftContext.objectives_map[objective_entity];
    const newObjectives = entityObjectives.objectives[entityObjectives.current_index];

    draftContext.all_policy_creation_objectives = draftContext.all_policy_creation_objectives
      .filter(objective => objective.entity !== objective_entity)
      .concat(newObjectives);

    entityObjectives.current_index += 1;
  });

  return { updatedContext };
}
