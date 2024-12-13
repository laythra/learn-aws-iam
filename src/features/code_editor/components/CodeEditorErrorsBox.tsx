import { Box } from '@chakra-ui/react';
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
        {errors.map(error => (
          <Box key={error.from} color='red.500'>
            {error.message}
          </Box>
        ))}
      </Box>
    );
  }
};
