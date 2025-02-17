import { HStack, Text } from '@chakra-ui/react';
import { ExclamationCircleIcon } from '@heroicons/react/16/solid';
import { useSelector } from '@xstate/store/react';

import codeEditorStateStore from '../stores/code-editor-state-store';
import { IAMScriptableEntity } from '@/types';

interface CodeEditorWarningsBoxProps {
  nodeId: string;
  selectedIAMEntity: IAMScriptableEntity;
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
      <>
        {warnings.map(warning => (
          <HStack key={warning} color='yellow.600'>
            <ExclamationCircleIcon height='1em' width='1em' />
            <Text fontWeight='semibold'>{warning}</Text>
          </HStack>
        ))}
      </>
    );
  }
};
