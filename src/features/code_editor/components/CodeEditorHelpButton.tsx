import React from 'react';

import { Box, IconButton, Tooltip } from '@chakra-ui/react';
import { QuestionMarkCircleIcon } from '@heroicons/react/16/solid';

import AnimatedRedDot from '@/components/Animated/AnimatedRedDot';
import codeEditorStateStore from '@/stores/code-editor-state-store';
import { IAMCodeDefinedEntity } from '@/types/iam-enums';

interface CodeEditorHelpButtonProps {
  selectedEntity: IAMCodeDefinedEntity;
}
const CodeEditorHelpButton: React.FC<CodeEditorHelpButtonProps> = ({ selectedEntity }) => {
  const showPolicyHelpPopup = (): void => {
    codeEditorStateStore.send({ type: 'showHelpPopup', entity: selectedEntity });
  };

  return (
    <Box position='relative' display='flex' alignItems='center'>
      <Tooltip hasArrow label='Show Policy Syntax Help' openDelay={200} shouldWrapChildren>
        <IconButton
          icon={<QuestionMarkCircleIcon />}
          aria-label='Help'
          size='sm'
          variant='ghost'
          onClick={showPolicyHelpPopup}
        />
      </Tooltip>
      <AnimatedRedDot placement='top-left' offset={2} />
    </Box>
  );
};

export default CodeEditorHelpButton;
