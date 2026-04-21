import { HStack } from '@chakra-ui/react';

import ARNIconButton from './ARNIconButton';
import NodePolicyButton from './NodePolicyButton';
import TagsIconButton from './TagsIconButton';
import { IAMCodeDefinedEntity, IAMNodeEntity } from '@/types/iam-enums';
import { IAMAnyNode } from '@/types/iam-node-types';
import { VoidEvent } from '@/types/state-machine-event-enums';

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
        onOpenEvent={VoidEvent.IAMNodeTagsOpened}
        onCloseEvent={VoidEvent.IAMNodeTagsPopoverClosed}
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
        onOpenEvent={VoidEvent.IAMNodeARNOpened}
        onCloseEvent={VoidEvent.IAMNodeARNClosed}
        onCopyEvent={VoidEvent.IAMNodeARNCopied}
        placement='top-end'
      />
    )}
  </HStack>
);

export default NodeInfoButtons;
