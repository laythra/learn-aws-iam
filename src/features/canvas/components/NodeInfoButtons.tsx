import { HStack } from '@chakra-ui/react';

import ARNIconButton from './ARNIconButton';
import NodePolicyButton from './NodePolicyButton';
import TagsIconButton from './TagsIconButton';
import { IAMCodeDefinedEntity, IAMNodeEntity } from '@/types/iam-enums';
import { IAMAnyNode } from '@/types/iam-node-types';
import { StatelessStateMachineEvent } from '@/types/state-machine-event-enums';

export interface NodeInfoButtonsProps {
  nodeId: string;
  label: string;
  entity: IAMNodeEntity;
  tags: IAMAnyNode['data']['tags'];
  content: IAMAnyNode['data']['content'];
  arn: string | undefined;
  editable: boolean;
}

const NodeInfoButtons: React.FC<NodeInfoButtonsProps> = ({
  nodeId,
  label,
  entity,
  tags,
  content,
  arn,
  editable,
}) => (
  <HStack position='absolute' top={1} right={2} spacing={1}>
    {tags && (
      <TagsIconButton
        placement='top-end'
        tags={tags}
        nodeId={nodeId}
        onOpenEvent={StatelessStateMachineEvent.IAMNodeTagsOpened}
      />
    )}
    {content && (
      <NodePolicyButton
        nodeId={nodeId}
        label={label}
        codeDescription={content}
        placement='top-end'
        editable={editable}
        selectedIAMEntity={entity as IAMCodeDefinedEntity}
      />
    )}
    {arn && (
      <ARNIconButton
        nodeId={nodeId}
        arn={arn}
        onCopyEvent={StatelessStateMachineEvent.IAMNodeARNCopied}
        onOpenEvent={StatelessStateMachineEvent.IAMNodeARNOpened}
        placement='top-end'
      />
    )}
  </HStack>
);

export default NodeInfoButtons;
