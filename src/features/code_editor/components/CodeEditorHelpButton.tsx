import React from 'react';

import { Box, IconButton } from '@chakra-ui/react';
import { QuestionMarkCircleIcon } from '@heroicons/react/16/solid';

import AnimatedRedDot from '@/components/AnimatedRedDot';
import HoverTooltip from '@/components/HoverTooltip';
import { ElementID } from '@/config/element-ids';
import { useAnimatedRedDot } from '@/runtime/ui/useAnimatedRedDot';
import codeEditorStateStore from '@/stores/code-editor-state-store';
import { IAMCodeDefinedEntity } from '@/types/iam-enums';

interface CodeEditorHelpButtonProps {
  selectedEntity: IAMCodeDefinedEntity;
}
const CodeEditorHelpButton: React.FC<CodeEditorHelpButtonProps> = ({ selectedEntity }) => {
  const { isRedDotEnabledForElement } = useAnimatedRedDot();

  const showPolicyHelpPopup = (): void => {
    codeEditorStateStore.send({ type: 'showHelpPopup', entity: selectedEntity });
  };

  return (
    <Box position='relative' display='flex' alignItems='center'>
      <HoverTooltip hasArrow label='Show Policy Syntax Help' openOnMount initialOpenDelay={1000}>
        <IconButton
          icon={<QuestionMarkCircleIcon width={24} height={24} />}
          aria-label='Help'
          size='sm'
          variant='ghost'
          onClick={showPolicyHelpPopup}
        />
      </HoverTooltip>
      {isRedDotEnabledForElement(ElementID.CodeEditorHelpButton) && (
        <AnimatedRedDot placement='top-left' offset={2} />
      )}
    </Box>
  );
};

export default CodeEditorHelpButton;
