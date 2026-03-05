import { HStack } from '@chakra-ui/react';

// Width per button in Chakra spacing units (~24px each) + right offset of the HStack.
// Used by the parent node to reserve space and prevent content overlap.
// Note: this is a layout workaround for absolute positioning — ideally, shouldn't need to be calculated manually.
const INFO_BUTTON_WIDTH = 6;
const INFO_BUTTON_RIGHT_OFFSET = 2;

export function getInfoButtonsReservedWidth(buttonCount: number): number {
  return buttonCount > 0 ? buttonCount * INFO_BUTTON_WIDTH + INFO_BUTTON_RIGHT_OFFSET : 0;
}

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
