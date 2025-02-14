import { Box, HStack, Text } from '@chakra-ui/react';
import { ExclamationCircleIcon } from '@heroicons/react/16/solid';
import { useSelector } from '@xstate/store/react';

import codeEditorStateStore from '../stores/code-editor-state-store';
import { IAMScriptableEntity } from '@/types';

interface CodeEditorErrorsBoxProps {
  nodeId: string;
  selectedIAMEntity: IAMScriptableEntity;
}

export const CodeEditorErrorsBox: React.FC<CodeEditorErrorsBoxProps> = ({
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
      <HStack spacing={3} align='center' borderRadius='lg' p={2.5} w='fit-content'>
        <Box w='12px' h='12px' bg='red.500' borderRadius='full' boxShadow='0 0 4px red' />
        <Text color='red.500' fontSize='md' fontWeight='medium'>
          {errors[0].message}
        </Text>
      </HStack>
    );
  }
};
