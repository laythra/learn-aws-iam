import { type Node } from 'reactflow';

import { ResourceNodeID } from '../types/node-id-enums';
import { createResourceNode } from '@/factories/resource-node-factory';
import type { IAMResourceNodeData } from '@/types';
import { IAMNodeImage, IAMNodeResourceEntity } from '@/types';

const IN_LEVEL_RESOURCE_NODES: Partial<IAMResourceNodeData>[] = [
  {
    id: ResourceNodeID.CustomerDataDynamoTable,
    label: 'CustomerData',
    initial_position: 'top-center',
    image: IAMNodeImage.Database,
    resource_type: IAMNodeResourceEntity.DynamoDBTable,
  },
  {
    id: ResourceNodeID.AnalyticsDataDynanoTable,
    label: 'AnalyticsData',
    initial_position: 'top-center',
    image: IAMNodeImage.Database,
    resource_type: IAMNodeResourceEntity.DynamoDBTable,
  },
  {
    id: ResourceNodeID.SecureCorpLogsS3Bucket,
    label: 'securecorp-logs',
    initial_position: 'top-center',
    image: IAMNodeImage.S3Bucket,
    resource_type: IAMNodeResourceEntity.S3Bucket,
  },
  {
    id: ResourceNodeID.SecureCorpDataS3Bucket,
    label: 'securecorp-data',
    initial_position: 'top-center',
    image: IAMNodeImage.S3Bucket,
    resource_type: IAMNodeResourceEntity.S3Bucket,
  },
];

export const INITIAL_IN_LEVEL_RESOURCE_NODES: Node<IAMResourceNodeData>[] =
  IN_LEVEL_RESOURCE_NODES.map(createResourceNode);
