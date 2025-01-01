import { HandleProps, Position, type Node } from 'reactflow';

import { ResourceNodeID } from '../types/node-id-enums';
import { createResourceNode } from '@/factories/resource-node-factory';
import type { IAMResourceNodeData } from '@/types';
import { IAMNodeImage, IAMNodeResourceEntity } from '@/types';

const TUTORIAL_RESOURCE_NODES: Partial<IAMResourceNodeData>[] = [
  {
    id: ResourceNodeID.BillingAndCostManagement,
    label: 'Billing and Cost Management',
    initial_position: 'right-center',
    image: IAMNodeImage.Billing,
    resource_type: IAMNodeResourceEntity.Billing,
  },
  {
    id: ResourceNodeID.FinanceS3Bucket,
    label: 'financial-reports-bucket',
    initial_position: 'right-center',
    image: IAMNodeImage.S3Bucket,
    resource_type: IAMNodeResourceEntity.S3Bucket,
  },
];

const IN_LEVEL_RESOURCE_NODES: Partial<IAMResourceNodeData>[] = [
  {
    id: ResourceNodeID.LambdaFunction,
    label: 'Lambda Function',
    initial_position: 'left-center',
    image: IAMNodeImage.Lambda,
    resource_type: IAMNodeResourceEntity.Lambda,
  },
  {
    id: ResourceNodeID.UsersCertificatesS3Bucket,
    label: 'users-certificates',
    initial_position: 'left-center',
    image: IAMNodeImage.S3Bucket,
    resource_type: IAMNodeResourceEntity.S3Bucket,
  },
  {
    id: ResourceNodeID.TimeshiftLabsEC2Instance,
    label: 'web-server',
    initial_position: 'left-center',
    image: IAMNodeImage.Server,
    resource_type: IAMNodeResourceEntity.EC2Instance,
  },
];

export const INITIAL_TUTORIAL_RESOURCE_NODES: Node<IAMResourceNodeData>[] =
  TUTORIAL_RESOURCE_NODES.map(createResourceNode);

export const INITIAL_IN_LEVEL_RESOURCE_NODES: Node<IAMResourceNodeData>[] =
  IN_LEVEL_RESOURCE_NODES.map(createResourceNode);
