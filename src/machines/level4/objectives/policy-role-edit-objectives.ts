import Ajv from 'ajv';

import dataScientistsPolicy from '../schemas/edit-objectives-schemas/data-scientists-policy.json';
import developersPolicy from '../schemas/edit-objectives-schemas/developers-policy.json';
import internsPolicy from '../schemas/edit-objectives-schemas/interns-policy.json';
import { NodeEditFinishEvent } from '../types/finish-event-enums';
import { PolicyNodeID, ResourceNodeID } from '../types/node-id-enums';
import { IAMPolicyRoleEditObjective } from '@/machines/types';
import { AccessLevel, IAMNodeEntity } from '@/types';

const AJV_COMPILER = new Ajv();

export const POLICY_ROLE_EDIT_OBJECTIVES: IAMPolicyRoleEditObjective<NodeEditFinishEvent>[][] = [
  [
    {
      entity_id: PolicyNodeID.DeveloperPolicy,
      entity: IAMNodeEntity.Policy,
      json_schema: developersPolicy,
      on_finish_event: NodeEditFinishEvent.DEVELOPER_POLICY_EDITED,
      resources_to_grant: {
        [ResourceNodeID.AnalyticsDataDynanoTable]: AccessLevel.Read,
      },
      resources_to_revoke: [
        ResourceNodeID.AnalyticsDataDynanoTable,
        ResourceNodeID.CustomerDataDynamoTable,
      ],
      validate_function: AJV_COMPILER.compile(developersPolicy),
    },
    {
      entity_id: PolicyNodeID.DataScientistPolicy,
      entity: IAMNodeEntity.Policy,
      json_schema: dataScientistsPolicy,
      on_finish_event: NodeEditFinishEvent.DATA_SCIENTIST_POLICY_EDITED,
      resources_to_grant: {
        [ResourceNodeID.AnalyticsDataDynanoTable]: AccessLevel.Read,
        [ResourceNodeID.CustomerDataDynamoTable]: AccessLevel.Read,
        [ResourceNodeID.SecureCorpDataS3Bucket]: AccessLevel.Read,
      },
      resources_to_revoke: [
        ResourceNodeID.AnalyticsDataDynanoTable,
        ResourceNodeID.CustomerDataDynamoTable,
      ],
      validate_function: AJV_COMPILER.compile(dataScientistsPolicy),
    },
    {
      entity_id: PolicyNodeID.InternPolicy,
      entity: IAMNodeEntity.Policy,
      json_schema: internsPolicy,
      on_finish_event: NodeEditFinishEvent.DEVELOPER_POLICY_EDITED,
      resources_to_grant: {
        [ResourceNodeID.SecureCorpLogsS3Bucket]: AccessLevel.Read,
      },
      resources_to_revoke: [],
      validate_function: AJV_COMPILER.compile(internsPolicy),
    },
  ],
];
