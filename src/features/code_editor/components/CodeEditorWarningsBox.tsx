import { HStack, Text } from '@chakra-ui/react';
import { ExclamationCircleIcon } from '@heroicons/react/16/solid';
import { useSelector } from '@xstate/store/react';

import codeEditorStateStore from '../stores/code-editor-state-store';
import { IAMCodeDefinedEntity } from '@/types';

interface CodeEditorWarningsBoxProps {
  nodeId: string;
  selectedIAMEntity: IAMCodeDefinedEntity;
}

export const CodeEditorWarningsBox: React.FC<CodeEditorWarningsBoxProps> = ({
  nodeId,
  selectedIAMEntity,
}) => {
  const warnings = useSelector(
    codeEditorStateStore,
    state => state.context.warnings[selectedIAMEntity][nodeId]
  );

  if (!warnings || warnings.length === 0) {
    return null;
  } else {
    return (
      <HStack color='yellow.600'>
        <ExclamationCircleIcon height='1em' width='1em' />
        <Text fontWeight='semibold'>{warnings[0]}</Text>
      </HStack>
    );
  }
};
