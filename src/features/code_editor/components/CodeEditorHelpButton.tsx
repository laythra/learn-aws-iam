import React from 'react';

import { Box, IconButton } from '@chakra-ui/react';
import { QuestionMarkCircleIcon } from '@heroicons/react/16/solid';

import codeEditorStateStore from '../stores/code-editor-state-store';
import AnimatedRedDot from '@/components/Animated/AnimatedRedDot';
import { ElementID } from '@/config/element-ids';
import { useAnimatedRedDot } from '@/hooks/useAnimatedRedDot';
import { IAMCodeDefinedEntity } from '@/types';

interface CodeEditorHelpButtonProps {
  selectedEntity: IAMCodeDefinedEntity;
}
const CodeEditorHelpButton: React.FC<CodeEditorHelpButtonProps> = ({ selectedEntity }) => {
  const showPolicyHelpPopup = (): void => {
    codeEditorStateStore.send({ type: 'showHelpPopup', entity: selectedEntity });
  };

  const { isRedDotEnabledForElement } = useAnimatedRedDot({
    elementIds: [ElementID.CodeEditorHelpButton],
  });

  return (
    <Box position='relative'>
      <IconButton
        icon={<QuestionMarkCircleIcon />}
        aria-label='Help'
        size='xs'
        variant='ghost'
        onClick={showPolicyHelpPopup}
      />
      {isRedDotEnabledForElement(ElementID.CodeEditorHelpButton) && (
        <AnimatedRedDot placement='bottom-left' offset={3} />
      )}
    </Box>
  );
};

export default CodeEditorHelpButton;
