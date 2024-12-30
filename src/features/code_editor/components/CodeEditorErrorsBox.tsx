import { Box, Text } from '@chakra-ui/react';
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
      <Box>
        <Text color='red.500' fontSize='lg'>
          {errors[0].message}
        </Text>
      </Box>
    );
  }
};
