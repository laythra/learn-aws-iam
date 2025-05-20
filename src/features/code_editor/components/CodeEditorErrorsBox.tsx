import { HStack, Text } from '@chakra-ui/react';
import { ExclamationCircleIcon } from '@heroicons/react/16/solid';
import { useSelector } from '@xstate/store/react';

import codeEditorStateStore from '../stores/code-editor-state-store';
import { IAMCodeDefinedEntity } from '@/types';

interface CodeEditorerrorsBoxProps {
  nodeId: string;
  selectedIAMEntity: IAMCodeDefinedEntity;
}

export const CodeEditorErrorsBox: React.FC<CodeEditorerrorsBoxProps> = ({
  nodeId,
  selectedIAMEntity,
}) => {
  const errors = useSelector(
    codeEditorStateStore,
    state => state.context.errors[selectedIAMEntity][nodeId]
  );

  if (!errors || errors.length === 0) {
    return null;
  } else {
    return (
      <HStack color='red.600'>
        <ExclamationCircleIcon height='1em' width='1em' />
        <Text fontWeight='semibold'>{errors[0].message}</Text>
      </HStack>
    );
  }
};
