import React from 'react';

import { Button, Icon } from '@chakra-ui/react';
import { ArrowPathIcon } from '@heroicons/react/20/solid';

import HoverTooltip from '@/components/HoverTooltip';
import codeEditorStateStore from '@/stores/code-editor-state-store';

interface CodeEditorResetButtonProps {
  nodeId: string;
}

/**
 * a simple button to reset the code editor content for the selected node/entity.
 * Used when editing an existing node/entity, to reset the code to the original content to help the user start over.
 */
const CodeEditorResetButton: React.FC<CodeEditorResetButtonProps> = ({ nodeId }) => {
  const resetCode = (): void => {
    codeEditorStateStore.send({
      type: 'clearContent',
      nodeId,
    });
  };

  return (
    <HoverTooltip label='Reset the code to its original state' placement='top' hasArrow>
      <Button leftIcon={<Icon as={ArrowPathIcon} boxSize={4} />} onClick={resetCode}>
        Reset Code
      </Button>
    </HoverTooltip>
  );
};

export default CodeEditorResetButton;
