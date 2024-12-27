import { Box, Text } from '@chakra-ui/react';
import { useSelector } from '@xstate/store/react';

import codeEditorStateStore from '../stores/code-editor-state-store';

interface CodeEditorErrorsBoxProps {
  nodeId: string;
}

export const CodeEditorErrorsBox: React.FC<CodeEditorErrorsBoxProps> = ({ nodeId }) => {
  const errors = useSelector(codeEditorStateStore, state => state.context.errors[nodeId]);

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
