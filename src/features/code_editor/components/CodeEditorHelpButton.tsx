import React from 'react';

import { IconButton } from '@chakra-ui/react';
import { QuestionMarkCircleIcon } from '@heroicons/react/16/solid';

import codeEditorStateStore from '../stores/code-editor-state-store';
import { IAMScriptableEntity } from '@/types';

interface CodeEditorHelpButtonProps {
  selectedEntity: IAMScriptableEntity;
}
const CodeEditorHelpButton: React.FC<CodeEditorHelpButtonProps> = ({ selectedEntity }) => {
  const showPolicyHelpPopup = (): void => {
    codeEditorStateStore.send({ type: 'showHelpPopup', entity: selectedEntity });
  };

  return (
    <IconButton
      icon={<QuestionMarkCircleIcon />}
      aria-label='Help'
      size='xs'
      variant='ghost'
      onClick={showPolicyHelpPopup}
    />
  );
};

export default CodeEditorHelpButton;
