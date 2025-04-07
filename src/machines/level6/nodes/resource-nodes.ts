import { ResourceNodeID } from '../types/node-id-enums';
import { createResourceNode } from '@/factories/nodes/resource-node-factory';
import { AccountID } from '@/machines/types';
import type { IAMResourceNode } from '@/types';
import { IAMNodeImage, IAMNodeResourceEntity } from '@/types';

const IN_LEVEL_RESOURCE_NODES: Partial<IAMResourceNode['data']>[] = [
  {
    id: ResourceNodeID.TrustingAccountDynamoDBTable,
    label: 'finance-reports',
    initial_position: 'left-center',
    image: IAMNodeImage.Database,
    resource_type: IAMNodeResourceEntity.DynamoDBTable,
    account_id: AccountID.Trusting,
  },
];

export const INITIAL_IN_LEVEL_RESOURCE_NODES: IAMResourceNode[] = IN_LEVEL_RESOURCE_NODES.map(
  nodeData => createResourceNode({ dataOverrides: nodeData })
);
