import React from 'react';

import { Button, Icon, Tooltip } from '@chakra-ui/react';
import { ArrowPathIcon } from '@heroicons/react/20/solid';

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
    <Tooltip label='Reset the code to its original state' placement='top'>
      <Button leftIcon={<Icon as={ArrowPathIcon} boxSize={4} />} onClick={resetCode}>
        Reset Code
      </Button>
    </Tooltip>
  );
};

export default CodeEditorResetButton;
