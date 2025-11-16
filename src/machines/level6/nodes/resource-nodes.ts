import { AccountID, ResourceNodeID } from '../types/node-id-enums';
import { createResourceNode } from '@/factories/nodes/resource-node-factory';
import type { IAMResourceNode } from '@/types';
import { CommonLayoutGroupID, IAMNodeImage, IAMNodeResourceEntity } from '@/types';

const IN_LEVEL_RESOURCE_NODES: Partial<IAMResourceNode['data']>[] = [
  {
    id: ResourceNodeID.TrustingAccountDynamoDBTable,
    label: 'finance-reports',
    layout_group_id: CommonLayoutGroupID.RightCenterHorizontal,
    image: IAMNodeImage.Database,
    resource_type: IAMNodeResourceEntity.DynamoDBTable,
    account_id: AccountID.TrustingAccount,
    parent_id: AccountID.TrustingAccount,
  },
];

export const INITIAL_IN_LEVEL_RESOURCE_NODES: IAMResourceNode[] = IN_LEVEL_RESOURCE_NODES.map(
  nodeData =>
    createResourceNode({ dataOverrides: nodeData, rootOverrides: { parentId: nodeData.parent_id } })
);
