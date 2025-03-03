import React from 'react';

import { IconButton } from '@chakra-ui/react';
import { QuestionMarkCircleIcon } from '@heroicons/react/16/solid';

import codeEditorStateStore from '../stores/code-editor-state-store';
import { IAMNodeEntity } from '@/types';

const CodeEditorHelpButton: React.FC = () => {
  const showPolicyHelpPopup = (): void => {
    codeEditorStateStore.send({ type: 'showHelpPopup', entity: IAMNodeEntity.Policy });
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
