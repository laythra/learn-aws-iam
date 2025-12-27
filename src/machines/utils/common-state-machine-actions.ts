import { produce } from 'immer';
import _ from 'lodash';

import { BaseFinishEventMap, LevelObjective } from '../types/objective-types';
import { GenericContext } from '../types/context-types';
import { ElementID } from '@/config/element-ids';

/**
 *  Edits the state of an objective, namely the `finished` property.
 * @param context The current state machine context
 * @param objectiveId The ID of the objective to edit
 * @param finished The new `finished` state of the objective
 * @returns Updated array of level objectives.
 */
export function editObjectiveState<TLevelObjectiveID, TFinishEventMap extends BaseFinishEventMap>(
  context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
  objectiveId: string,
  finished: boolean
): LevelObjective<TLevelObjectiveID, TFinishEventMap>[] {
  return produce(context.level_objectives, draftLevelObjectives => {
    const targetObjective = draftLevelObjectives.find(objective => objective.id === objectiveId);
    if (!targetObjective) return;

    targetObjective.finished = finished;
  });
}

export function getElementsWithRedDot<
  TLevelObjectiveID,
  TFinishEventMap extends BaseFinishEventMap,
>(
  context: GenericContext<TLevelObjectiveID, TFinishEventMap>,
  elementIds: ElementID[],
  isRedDotVisible: boolean
): ElementID[] {
  if (isRedDotVisible) {
    return _.uniq([...(context.elements_with_animated_red_dot ?? []), ...elementIds]);
  } else {
    return _.difference(context.elements_with_animated_red_dot ?? [], elementIds);
  }
}
